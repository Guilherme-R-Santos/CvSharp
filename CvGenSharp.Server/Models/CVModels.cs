namespace CvGenSharp.Server.Models;

public class PersonalInfo
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string? LinkedinUrl { get; set; }
    public string? PortfolioUrl { get; set; }
}

public class Education
{
    public string Id { get; set; } = string.Empty;
    public string School { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string Field { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class Experience
{
    public string Id { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public bool CurrentlyWorking { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<string> Highlights { get; set; } = new();
}

public class Skill
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Level { get; set; } = "intermediate"; // beginner, intermediate, advanced, expert
}

public class Project
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Technologies { get; set; } = new();
    public string? Url { get; set; }
}

public class Certificate
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string IssueDate { get; set; } = string.Empty;
    public string? ExpirationDate { get; set; }
    public string? CredentialUrl { get; set; }
}

public class CVData
{
    public PersonalInfo PersonalInfo { get; set; } = new();
    public List<Education> Education { get; set; } = new();
    public List<Experience> Experience { get; set; } = new();
    public List<Skill> Skills { get; set; } = new();
    public List<Project> Projects { get; set; } = new();
    public List<Certificate> Certificates { get; set; } = new();
}

public class OptimizationSettings
{
    public string Format { get; set; } = "pdf"; // pdf, docx, txt
    public bool IncludePhotography { get; set; }
    public bool UseKeywords { get; set; } = true;
}

public class GenerateCVRequest
{
    public CVData CvData { get; set; } = new();
    public OptimizationSettings? OptimizationSettings { get; set; }
}

public class GenerateCVResponse
{
    public bool Success { get; set; }
    public string? FileUrl { get; set; }
    public string? FileName { get; set; }
    public string? Message { get; set; }
}
