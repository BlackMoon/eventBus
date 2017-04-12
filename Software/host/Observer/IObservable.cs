namespace Host.Observer
{
    interface IObservable
    {
        void Register(IObserver o);
        void Unregister(IObserver o);
        void Notify();
    }
}