using System;

namespace Host.Adapter
{
    /// <summary>
    /// Интерфейс адаптера
    /// </summary>
    public interface IAdapter
    {
        string Name { get; set; }

        Version Version { get; set; }

        void Request();
    }
}
