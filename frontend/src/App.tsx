import { StatsBar } from "./components/StatsBar";
import { TicketForm } from "./components/TicketForm";
import { TicketList } from "./components/TicketList";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Mini <span className="text-accent">Ticket Tracker</span>
            </h1>
            <p className="text-xs text-gray-500">Lodwar Services</p>
          </div>
          <StatsBar />
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
        <TicketForm />
        <TicketList />
      </main>
    </div>
  );
}

export default App;
