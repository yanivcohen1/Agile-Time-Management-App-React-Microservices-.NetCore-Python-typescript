using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

public class LogAfterThrowingFilter : IExceptionFilter
{
    private readonly ILogger<LogAfterThrowingFilter> _logger;

    public LogAfterThrowingFilter(ILogger<LogAfterThrowingFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        // Equivalent to joinPoint.getSignature()
        var controllerName = context.RouteData.Values["controller"];
        var actionName = context.RouteData.Values["action"];
        var e = context.Exception;

        _logger.LogError(e, 
            "Exception in {Controller}.{Action}() with cause = '{Cause}' and exception = '{Message}'",
            controllerName, 
            actionName, 
            e.InnerException != null ? e.InnerException.ToString() : "NULL", 
            e.Message);
            
        // Note: In .NET filters, you usually don't re-throw; 
        // you set context.Result to send a response to the client.
    }
}