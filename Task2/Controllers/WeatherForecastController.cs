using Microsoft.AspNetCore.Mvc;
using Task2.Models;
using Task2.Services;

namespace Task2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
       
        private readonly IWeatherUpdateService _weatherUpdateService;

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IWeatherUpdateService weatherUpdateService)
        {
            _logger = logger;
            _weatherUpdateService = weatherUpdateService;
        }

        [HttpGet]
        public List<WeatherDetails> Get()
        {
            return  _weatherUpdateService.GetData();
        }
    }
}