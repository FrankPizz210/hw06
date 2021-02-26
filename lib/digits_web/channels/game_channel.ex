defmodule DigitsWeb.GameChannel do
  use DigitsWeb, :channel
  alias Digits.Game
  alias Digits.GameServer

  @impl true
  def join("game:" <> name, payload, socket) do
    if authorized?(payload) do
      GameServer.start(name)
      view = GameServer.peek(name)
      |> Game.view("")
      socket = assign(socket, :name, name)
      {:ok, view, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_in("login", user, socket) do
    IO.puts "Your are in ch_login"
    socket = assign(socket, :user, user)
    name = socket.assigns[:name]
    view = GameServer.peek(name)
    |> Game.view(user)
    {:reply, {:ok, view}, socket}
  end


  @impl true
  def handle_in("guess", ll, socket) do
    user = socket.assigns[:user]
    name = socket.assigns[:name]
    view = GameServer.guess(name, ll)
    |> Game.view(user)
    broadcast(socket, "view", view)
    {:reply, {:ok, view}, socket}
  end

  def handle_in("player", player, socket) do
    socket = assign(socket, :player, player)
    user = socket.assigns[:user]
    name = socket.assigns[:name]
    view = GameServer.peek(name)
    |> Game.view(user)
    broadcast(socket, "view", view)
    {:reply, {:ok, view}, socket}
  end

  @impl true
  def handle_in("reset", _, socket) do
    user = socket.assigns[:user]
    name = socket.assigns[:name]
    view = GameServer.reset(name)
    |> Game.view(user)
    broadcast(socket, "view", view)
    {:reply, {:ok, view}, socket}
  end

  @impl true
  def handle_in("updateGuess", text, socket) do
    user = socket.assigns[:user]
    name = socket.assigns[:name]
    view = GameServer.updateGuess(name, text)
    |> Game.view(user)
    broadcast(socket, "view", view)
    {:reply, {:ok, view}, socket}
  end

  @impl true
  def handle_in("start_game", %{"game_name" => game}, socket) do
    user = socket.assigns[:user]
    name = socket.assigns[:name]
    view = GameServer.start_game(name, game)
    |> Game.view(user)
    {:reply, {:ok, view}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
