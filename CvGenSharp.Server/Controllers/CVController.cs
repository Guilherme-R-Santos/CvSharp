using Microsoft.AspNetCore.Mvc;
using CvGenSharp.Server.Models;
using CvGenSharp.Server.Services;

namespace CvGenSharp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CVController : ControllerBase
{
    private readonly ICVGeneratorService _cvGeneratorService;
    private readonly ILogger<CVController> _logger;
    private readonly IWebHostEnvironment _env;

    public CVController(ICVGeneratorService cvGeneratorService, ILogger<CVController> logger, IWebHostEnvironment env)
    {
        _cvGeneratorService = cvGeneratorService;
        _logger = logger;
        _env = env;
    }

    [HttpPost("generate")]
    public async Task<ActionResult<GenerateCVResponse>> GenerateCV([FromBody] GenerateCVRequest request)
    {
        try
        {
            if (request?.CvData == null)
            {
                return BadRequest(new GenerateCVResponse
                {
                    Success = false,
                    Message = "Dados do currículo são obrigatórios"
                });
            }

            if (string.IsNullOrEmpty(request.CvData.PersonalInfo.FullName) ||
                string.IsNullOrEmpty(request.CvData.PersonalInfo.Email))
            {
                return BadRequest(new GenerateCVResponse
                {
                    Success = false,
                    Message = "Nome completo e email são obrigatórios"
                });
            }

            var fileUrl = await _cvGeneratorService.GenerateCVPdfAsync(
                request.CvData,
                request.OptimizationSettings
            );

            var fileName = Path.GetFileName(fileUrl);

            return Ok(new GenerateCVResponse
            {
                Success = true,
                FileUrl = fileUrl,
                FileName = fileName,
                Message = "Currículo gerado com sucesso!"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar currículo");

            var errorMessage = _env.IsDevelopment()
                ? $"Erro ao gerar currículo: {ex.Message}"
                : "Erro ao gerar currículo. Tente novamente.";

            return StatusCode(500, new GenerateCVResponse
            {
                Success = false,
                Message = errorMessage
            });
        }
    }

    [HttpPost("optimize")]
    public ActionResult<Dictionary<string, object>> OptimizeForATS([FromBody] CVData cvData)
    {
        try
        {
            var keywords = ExtractKeywords(cvData);
            var suggestions = GenerateSuggestions(cvData);

            return Ok(new
            {
                keywords,
                suggestions,
                atsScore = CalculateATSScore(cvData)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao otimizar para ATS");
            return StatusCode(500, new { error = "Erro ao otimizar para ATS" });
        }
    }

    private List<string> ExtractKeywords(CVData cvData)
    {
        var keywords = new List<string>();

        keywords.AddRange(cvData.Skills.Select(s => s.Name));
        keywords.AddRange(cvData.Experience.SelectMany(e => e.Description.Split(' ').Where(w => w.Length > 5)));
        keywords.AddRange(cvData.Projects.SelectMany(p => p.Technologies));

        return keywords.Distinct().ToList();
    }

    private List<string> GenerateSuggestions(CVData cvData)
    {
        var suggestions = new List<string>();

        if (cvData.Experience.Count == 0)
            suggestions.Add("Adicione experiência profissional para melhorar a compatibilidade com ATS");

        if (cvData.Education.Count == 0)
            suggestions.Add("Adicione informações sobre educação");

        if (cvData.Skills.Count < 5)
            suggestions.Add("Adicione mais habilidades (mínimo 5 recomendado para ATS)");

        if (string.IsNullOrEmpty(cvData.PersonalInfo.Summary) || cvData.PersonalInfo.Summary.Length < 50)
            suggestions.Add("Expanda o resumo profissional com mais informações");

        if (cvData.Projects.Count == 0)
            suggestions.Add("Adicione projetos para demonstrar habilidades práticas");

        return suggestions;
    }

    private double CalculateATSScore(CVData cvData)
    {
        double score = 0;

        // Personal info (20 points)
        if (!string.IsNullOrEmpty(cvData.PersonalInfo.FullName)) score += 5;
        if (!string.IsNullOrEmpty(cvData.PersonalInfo.Email)) score += 5;
        if (!string.IsNullOrEmpty(cvData.PersonalInfo.Phone)) score += 5;
        if (!string.IsNullOrEmpty(cvData.PersonalInfo.Summary) && cvData.PersonalInfo.Summary.Length > 50) score += 5;

        // Experience (25 points)
        var maxExp = Math.Min(cvData.Experience.Count, 5);
        score += maxExp * 5;

        // Education (15 points)
        var maxEdu = Math.Min(cvData.Education.Count, 3);
        score += maxEdu * 5;

        // Skills (20 points)
        var skillsScore = Math.Min(cvData.Skills.Count, 10) * 2;
        score += skillsScore;

        // Projects (10 points)
        var maxProj = Math.Min(cvData.Projects.Count, 2);
        score += maxProj * 5;

        // Certificates (10 points)
        var maxCerts = Math.Min(cvData.Certificates.Count, 2);
        score += maxCerts * 5;

        return Math.Min(score, 100);
    }
}
