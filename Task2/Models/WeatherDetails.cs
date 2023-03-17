using System;

namespace Task2.Models
{
    public class WeatherDetails
    {
        public string Country { get; set; } = default!;
        public string City { get; set; } = default!;
        public decimal Temperature { get; set; } = default!;
        public decimal WindSpeed { get; set; } = default!;
        public DateTime LastUpdateTime { get; set; } = default!;
    }
}
