defmodule Digits.GameServer do
  use GenServer

  def reg(name) do
    {:via, Registry, {Digits.GameReg, name}}
  end

  def start(name) do
    spec = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [name]},
      restart: :permanent,
      type: :worker,
    }
    Digits.GameSup.start_child(spec)
  end

  def start_link(name) do
    IO.puts "start_link"
    # Digits.BackupAgent.get(name) ||
    game =  Digits.Game.new()
    IO.inspect game
    #game = Digits.BackupAgent.get(name) || Digits.Game.new(&sched_round(name, &1))
    GenServer.start_link(__MODULE__, game, name: reg(name))
  end


  def init(game) do
    {:ok, game}
  end

  def login(name, user) do
    GenServer.call(reg(name), {:login, name, user})
  end


  def guess(name, letter) do
    GenServer.call(reg(name), {:guess, name, letter})
  end

  def reset(name) do
    GenServer.call(reg(name), {:reset, name})
  end

  def updateGuess(name, text) do
    GenServer.call(reg(name), {:updateGuess, name, text})
  end

  def peek(name) do
    GenServer.call(reg(name), {:peek, name})
  end

  def init(game) do
    {:ok, game}
  end

  def handle_call({:join, name, user}, _from, game) do
    game = Digits.Game.add_player(game, user)
    Digits.BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:ready, name, user}, _from, game) do
    game = Digits.Game.ready_player(game, user)
    Digits.BackupAgent.put(name, game)
    {:reply, game, game}
  end


  def handle_call({:view, _name}, _from, game) do
    view = Digits.Game.view(game)
    {:reply, view, game}
  end

  def handle_call({:login, name, user}, _from, game) do
    game = Digits.Game.login(game, user)
    {:reply, game, game}
  end

  def handle_call({:guess, name, number}, _from, game) do
    game = Digits.Game.guess(game, number)
    Digits.BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:peek, name}, _from, game) do
    {:reply, game, game}
  end

  def handle_call({:reset, name}, _from, game) do
    game = Digits.Game.reset(game)
    #Digits.BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:player, name, type}, _from, game) do
    game = Digits.Game.player(type)
    Digits.BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_info({:maintain_round, name, round}, game) do
    game = Digits.Game.finish_round(game, round)
    view = Digits.Game.view(game)
    DigitsWeb.Endpoint.broadcast("game:" <> name, "view", view)
    {:noreply, game}
  end

  def handle_call({:updateGuess, name, text}, _from, game) do
    game = Digits.Game.updateGuess(game, text)
    Digits.BackupAgent.put(name, game)
    {:reply, game, game}
  end
end
