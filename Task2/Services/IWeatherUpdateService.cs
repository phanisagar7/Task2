using Task2.Models;

namespace Task2.Services
{
    public interface IWeatherUpdateService
    {
        List<WeatherDetails> GetData();
    }
}
