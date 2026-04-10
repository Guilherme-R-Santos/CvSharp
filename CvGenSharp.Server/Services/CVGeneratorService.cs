using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Kernel.Colors;
using CvGenSharp.Server.Models;
using System.Text;

namespace CvGenSharp.Server.Services;

public interface ICVGeneratorService
{
    Task<string> GenerateCVPdfAsync(CVData cvData, OptimizationSettings? settings = null);
}

public class CVGeneratorService : ICVGeneratorService
{
    private readonly ILogger<CVGeneratorService> _logger;
    private readonly string _outputDir;

    public CVGeneratorService(ILogger<CVGeneratorService> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        _outputDir = Path.Combine(env.ContentRootPath, "wwwroot", "cvs");
        
        if (!Directory.Exists(_outputDir))
        {
            Directory.CreateDirectory(_outputDir);
        }
    }

    public async Task<string> GenerateCVPdfAsync(CVData cvData, OptimizationSettings? settings = null)
    {
        try
        {
            cvData = Normalize(cvData);

            var safeFullName = BuildSafeFileName(cvData.PersonalInfo.FullName);
            var fileName = $"CV_{safeFullName}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";
            var filePath = Path.Combine(_outputDir, fileName);

            using (var writer = new PdfWriter(filePath))
            using (var pdf = new PdfDocument(writer))
            using (var document = new Document(pdf))
            {
                document.SetMargins(30, 30, 30, 30);

                // Header - Personal Info
                AddPersonalHeader(document, cvData.PersonalInfo);

                // Summary
                if (!string.IsNullOrEmpty(cvData.PersonalInfo.Summary))
                {
                    AddSection(document, "RESUMO PROFISSIONAL");
                    var summaryPara = new Paragraph(SanitizePdfText(cvData.PersonalInfo.Summary))
                        .SetFontSize(10)
                        .SetMarginBottom(12);
                    document.Add(summaryPara);
                }

                // Experience
                if (cvData.Experience.Count > 0)
                {
                    AddSection(document, "EXPERIÊNCIA PROFISSIONAL");
                    foreach (var exp in cvData.Experience)
                    {
                        AddExperienceEntry(document, exp);
                    }
                }

                // Education
                if (cvData.Education.Count > 0)
                {
                    AddSection(document, "EDUCAÇÃO");
                    foreach (var edu in cvData.Education)
                    {
                        AddEducationEntry(document, edu);
                    }
                }

                // Skills
                if (cvData.Skills.Count > 0)
                {
                    AddSection(document, "HABILIDADES");
                    AddSkillsEntry(document, cvData.Skills);
                }

                // Projects
                if (cvData.Projects.Count > 0)
                {
                    AddSection(document, "PROJETOS");
                    foreach (var proj in cvData.Projects)
                    {
                        AddProjectEntry(document, proj);
                    }
                }

                // Certificates
                if (cvData.Certificates.Count > 0)
                {
                    AddSection(document, "CERTIFICAÇÕES");
                    foreach (var cert in cvData.Certificates)
                    {
                        AddCertificateEntry(document, cert);
                    }
                }
            }

            _logger.LogInformation($"CV generated successfully: {filePath}");
            await Task.CompletedTask;
            return $"/cvs/{fileName}";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating CV PDF");
            throw;
        }
    }

    private void AddPersonalHeader(Document document, PersonalInfo info)
    {
        // Name
        var namePara = new Paragraph(SanitizePdfText(info.FullName))
            .SetFontSize(24)
            .SetBold()
            .SetMarginBottom(6);
        document.Add(namePara);

        // Contact info
        var contactParts = new List<string>();
        if (!string.IsNullOrEmpty(info.Email))
            contactParts.Add(SanitizePdfText(info.Email));
        if (!string.IsNullOrEmpty(info.Phone))
            contactParts.Add(SanitizePdfText(info.Phone));
        if (!string.IsNullOrEmpty(info.Location))
            contactParts.Add(SanitizePdfText(info.Location));

        if (contactParts.Count > 0)
        {
            var contactPara = new Paragraph(string.Join(" | ", contactParts))
                .SetFontSize(9)
                .SetFontColor(ColorConstants.DARK_GRAY)
                .SetMarginBottom(10);
            document.Add(contactPara);
        }

        // URLs
        if (!string.IsNullOrEmpty(info.LinkedinUrl) || !string.IsNullOrEmpty(info.PortfolioUrl))
        {
            var urlParts = new List<string>();
            if (!string.IsNullOrEmpty(info.LinkedinUrl))
                urlParts.Add($"LinkedIn: {SanitizePdfText(info.LinkedinUrl)}");
            if (!string.IsNullOrEmpty(info.PortfolioUrl))
                urlParts.Add($"Portfólio: {SanitizePdfText(info.PortfolioUrl)}");

            var urlPara = new Paragraph(string.Join(" | ", urlParts))
                .SetFontSize(9)
                .SetFontColor(ColorConstants.DARK_GRAY)
                .SetMarginBottom(12);
            document.Add(urlPara);
        }
    }

    private void AddSection(Document document, string sectionTitle)
    {
        var section = new Paragraph(sectionTitle)
            .SetBold()
            .SetFontSize(12)
            .SetMarginTop(8)
            .SetMarginBottom(6)
            .SetFontColor(new DeviceRgb(0, 102, 204)); // Sky Blue color
        document.Add(section);

        // Add a line
        var line = new LineSeparator(new iText.Kernel.Pdf.Canvas.Draw.SolidLine());
        document.Add(new Paragraph().Add(line).SetMarginBottom(6));
    }

    private void AddExperienceEntry(Document document, Experience exp)
    {
        // Company and Position
        var header = new Paragraph();
        header.Add(new Text(SanitizePdfText(exp.Position)).SetBold().SetFontSize(11));
        header.Add(new Text($" - {SanitizePdfText(exp.Company)}").SetFontSize(10));
        document.Add(header);

        // Dates
        var datePara = new Paragraph()
            .SetFontSize(9)
            .SetFontColor(ColorConstants.DARK_GRAY);
        datePara.Add($"{SanitizePdfText(exp.StartDate)} - ");
        if (exp.CurrentlyWorking)
            datePara.Add("Presente");
        else
            datePara.Add(SanitizePdfText(exp.EndDate));
        document.Add(datePara);

        // Description
        if (!string.IsNullOrEmpty(exp.Description))
        {
            var descPara = new Paragraph(SanitizePdfText(exp.Description))
                .SetFontSize(10)
                .SetMarginBottom(4);
            document.Add(descPara);
        }

        // Highlights
        if (exp.Highlights.Count > 0)
        {
            var table = new Table(1);
            table.SetWidth(UnitValue.CreatePercentValue(100));
            foreach (var highlight in exp.Highlights)
            {
                var cell = new Cell()
                    .Add(new Paragraph($"- {SanitizePdfText(highlight)}").SetFontSize(9))
                    .SetBorder(iText.Layout.Borders.Border.NO_BORDER)
                    .SetPadding(2);
                table.AddCell(cell);
            }
            document.Add(table);
        }

        document.Add(new Paragraph().SetMarginBottom(8));
    }

    private void AddEducationEntry(Document document, Education edu)
    {
        // Degree and Field
        var header = new Paragraph();
        header.Add(new Text(SanitizePdfText(edu.Degree)).SetBold().SetFontSize(11));
        header.Add(new Text($" em {SanitizePdfText(edu.Field)}").SetFontSize(10));
        document.Add(header);

        // School
        var schoolPara = new Paragraph(SanitizePdfText(edu.School))
            .SetFontSize(10)
            .SetFontColor(ColorConstants.DARK_GRAY);
        document.Add(schoolPara);

        // Dates
        var datePara = new Paragraph($"{SanitizePdfText(edu.StartDate)} - {SanitizePdfText(edu.EndDate)}")
            .SetFontSize(9)
            .SetFontColor(ColorConstants.DARK_GRAY)
            .SetMarginBottom(4);
        document.Add(datePara);

        // Description
        if (!string.IsNullOrEmpty(edu.Description))
        {
            var descPara = new Paragraph(SanitizePdfText(edu.Description))
                .SetFontSize(10)
                .SetMarginBottom(6);
            document.Add(descPara);
        }

        document.Add(new Paragraph().SetMarginBottom(8));
    }

    private void AddSkillsEntry(Document document, List<Skill> skills)
    {
        var skillsByLevel = skills.GroupBy(s => s.Level).OrderByDescending(g => GetLevelOrder(g.Key));

        foreach (var group in skillsByLevel)
        {
            var levelLabel = GetLevelLabel(group.Key);
            var skillNames = string.Join(", ", group.Select(s => SanitizePdfText(s.Name)));

            var para = new Paragraph();
            para.Add(new Text(levelLabel + ": ").SetBold().SetFontSize(10));
            para.Add(new Text(skillNames).SetFontSize(10));
            document.Add(para);
        }

        document.Add(new Paragraph().SetMarginBottom(8));
    }

    private void AddProjectEntry(Document document, Project proj)
    {
        // Project Name
        var header = new Paragraph(SanitizePdfText(proj.Name))
            .SetBold()
            .SetFontSize(11);
        document.Add(header);

        // Description
        var descPara = new Paragraph(SanitizePdfText(proj.Description))
            .SetFontSize(10)
            .SetMarginBottom(4);
        document.Add(descPara);

        // Technologies
        if (proj.Technologies.Count > 0)
        {
            var techPara = new Paragraph();
            techPara.Add(new Text("Tecnologias: ").SetBold().SetFontSize(9));
            techPara.Add(new Text(string.Join(", ", proj.Technologies.Select(SanitizePdfText))).SetFontSize(9));
            document.Add(techPara);
        }

        document.Add(new Paragraph().SetMarginBottom(8));
    }

    private void AddCertificateEntry(Document document, Certificate cert)
    {
        var header = new Paragraph();
        header.Add(new Text(SanitizePdfText(cert.Name)).SetBold().SetFontSize(10));
        header.Add(new Text($" - {SanitizePdfText(cert.Issuer)}").SetFontSize(10));
        document.Add(header);

        var datePara = new Paragraph($"Emitido em: {SanitizePdfText(cert.IssueDate)}")
            .SetFontSize(9)
            .SetFontColor(ColorConstants.DARK_GRAY)
            .SetMarginBottom(4);
        document.Add(datePara);

        document.Add(new Paragraph().SetMarginBottom(8));
    }

    private int GetLevelOrder(string level) => level switch
    {
        "expert" => 4,
        "advanced" => 3,
        "intermediate" => 2,
        "beginner" => 1,
        _ => 0
    };

    private string GetLevelLabel(string level) => level switch
    {
        "expert" => "Especialista",
        "advanced" => "Avançado",
        "intermediate" => "Intermediário",
        "beginner" => "Iniciante",
        _ => "Outro"
    };

    private static string BuildSafeFileName(string? rawName)
    {
        if (string.IsNullOrWhiteSpace(rawName))
            return "Curriculo";

        var invalidChars = Path.GetInvalidFileNameChars();
        var sb = new StringBuilder(rawName.Trim().Length);

        foreach (var ch in rawName.Trim())
        {
            if (invalidChars.Contains(ch))
            {
                sb.Append('_');
                continue;
            }

            sb.Append(char.IsWhiteSpace(ch) ? '_' : ch);
        }

        var sanitized = sb.ToString().Trim('_');
        return string.IsNullOrWhiteSpace(sanitized) ? "Curriculo" : sanitized;
    }

    private static CVData Normalize(CVData? cvData)
    {
        cvData ??= new CVData();
        cvData.PersonalInfo ??= new PersonalInfo();
        cvData.Education ??= new List<Education>();
        cvData.Experience ??= new List<Experience>();
        cvData.Skills ??= new List<Skill>();
        cvData.Projects ??= new List<Project>();
        cvData.Certificates ??= new List<Certificate>();
        return cvData;
    }

    private static string SanitizePdfText(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        var sb = new StringBuilder(text.Length);

        foreach (var ch in text)
        {
            if (char.IsControl(ch) && ch != '\n' && ch != '\r' && ch != '\t')
                continue;

            if (char.IsSurrogate(ch))
                continue;

            sb.Append(ch);
        }

        return sb.ToString();
    }
}
