using Castle.DynamicProxy;
using Microsoft.Extensions.Logging;

namespace AuthApi.Services;

public class ErrorLoggingInterceptor : IInterceptor
{
    private readonly ILogger<ErrorLoggingInterceptor> _logger;

    public ErrorLoggingInterceptor(ILogger<ErrorLoggingInterceptor> logger)
    {
        _logger = logger;
    }

    public void Intercept(IInvocation invocation)
    {
        try
        {
            invocation.Proceed();
        }
        catch (Exception ex)
        {
            var parameters = string.Join(", ", invocation.Arguments.Select(a => a?.ToString() ?? "null"));
            _logger.LogError(ex, "An error occurred in {Service}.{Method} with parameters [{Parameters}]. Message: {Message}. InnerException: {InnerException}", 
                invocation.TargetType.Name, 
                invocation.Method.Name, 
                parameters, 
                ex.Message, 
                ex.InnerException?.Message ?? "None");
            throw;
        }
    }
}