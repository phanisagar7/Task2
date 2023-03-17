using Microsoft.Extensions.Options;
using System.Data.SqlClient;
using Task2.Models;

namespace Task2.Services
{
    public class WeatherUpdateService : IWeatherUpdateService   
    {
        private readonly AppSettings _appSettings;

        public WeatherUpdateService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }
        public List<WeatherDetails> GetData()
        {
            List<WeatherDetails> weatherDetails = new();
            try
            {
                using SqlConnection conn = new(_appSettings.SqlConnectionString);
                conn.Open();
                string query = $"Select * from dbo.weather";
                using SqlCommand cmd = new(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        WeatherDetails forecast = new();
                        if (!reader.IsDBNull(1))
                            forecast.Country = reader.GetString(1).Trim();
                        if (!reader.IsDBNull(2))
                            forecast.City = reader.GetString(2).Trim();
                        if (!reader.IsDBNull(3))
                            forecast.Temperature = reader.GetDecimal(3);
                        if (!reader.IsDBNull(4))
                            forecast.WindSpeed = reader.GetDecimal(4);
                        if (!reader.IsDBNull(5))
                            forecast.LastUpdateTime = reader.GetDateTime(5);
                        weatherDetails.Add(forecast);
                    }
                    conn.Close();
                }
            }
            catch (Exception e)
            {
                throw;
            }
            return weatherDetails;
        }
    }
}
