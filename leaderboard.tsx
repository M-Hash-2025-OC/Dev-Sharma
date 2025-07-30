"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Info, Plus, Minus, Trophy, Medal, Award, User, Calendar, Code, Target } from "lucide-react"

interface Player {
  id: string
  name: string
  score: number
  avatar: string
  joinDate: string
  projects: number
  streak: number
  bio: string
}

interface RankChange {
  id: string
  message: string
  timestamp: number
}

const generateAvatar = (name: string) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]
  const colorIndex = name.length % colors.length
  return colors[colorIndex]
}

const generateRandomPlayer = (): Player => {
  const names = [
    "Alex Chen",
    "Sarah Kim",
    "Mike Johnson",
    "Emma Davis",
    "Ryan Park",
    "Lisa Wang",
    "David Lee",
    "Maya Patel",
  ]
  const name = names[Math.floor(Math.random() * names.length)]
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    score: Math.floor(Math.random() * 1000),
    avatar: generateAvatar(name),
    joinDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    projects: Math.floor(Math.random() * 10) + 1,
    streak: Math.floor(Math.random() * 15),
    bio: `Passionate developer participating in M# Hackathon. Love building innovative solutions!`,
  }
}

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([
    generateRandomPlayer(),
    generateRandomPlayer(),
    generateRandomPlayer(),
    generateRandomPlayer(),
    generateRandomPlayer(),
  ])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [newPlayerScore, setNewPlayerScore] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showModeratorPanel, setShowModeratorPanel] = useState(false)
  const [rankChanges, setRankChanges] = useState<RankChange[]>([])
  const [animatingPlayers, setAnimatingPlayers] = useState<Set<string>>(new Set())
  const prevRanksRef = useRef<Map<string, number>>(new Map())

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  useEffect(() => {
    const currentRanks = new Map<string, number>()
    sortedPlayers.forEach((player, index) => {
      currentRanks.set(player.id, index + 1)
    })

    // Check for rank changes
    sortedPlayers.forEach((player, currentIndex) => {
      const currentRank = currentIndex + 1
      const prevRank = prevRanksRef.current.get(player.id)

      if (prevRank && prevRank > currentRank) {
        // Player moved up
        const change: RankChange = {
          id: Math.random().toString(),
          message: `🚀 ${player.name} climbed to #${currentRank}!`,
          timestamp: Date.now(),
        }
        setRankChanges((prev) => [change, ...prev.slice(0, 4)])

        // Add animation
        setAnimatingPlayers((prev) => new Set([...prev, player.id]))
        setTimeout(() => {
          setAnimatingPlayers((prev) => {
            const newSet = new Set(prev)
            newSet.delete(player.id)
            return newSet
          })
        }, 2000)
      }
    })

    prevRanksRef.current = currentRanks
  }, [players])

  const addPlayer = () => {
    if (newPlayerName && newPlayerScore) {
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPlayerName,
        score: Number.parseInt(newPlayerScore),
        avatar: generateAvatar(newPlayerName),
        joinDate: new Date().toLocaleDateString(),
        projects: 0,
        streak: 0,
        bio: "New participant in M# Hackathon!",
      }
      setPlayers((prev) => [...prev, newPlayer])
      setNewPlayerName("")
      setNewPlayerScore("")
    }
  }

  const adjustScore = (playerId: string, adjustment: number) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, score: Math.max(0, player.score + adjustment) } : player,
      ),
    )
  }

  const handleLogin = () => {
    if (loginUsername === "admin" && loginPassword === "hack") {
      setIsAuthenticated(true)
      setLoginError("")
      setLoginUsername("")
      setLoginPassword("")
    } else {
      setLoginError("Invalid credentials")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowModeratorPanel(false)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 border border-purple-500/20 rounded-full"></div>
        <div className="absolute top-40 right-32 w-32 h-32 border border-blue-500/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-48 h-48 border border-pink-500/20 rounded-full"></div>
        <div className="absolute top-1/3 left-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-64 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M#</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">M# HACKATHON</h1>
              <p className="text-gray-400">Live Leaderboard</p>
            </div>
          </div>

          <Dialog open={showModeratorPanel} onOpenChange={setShowModeratorPanel}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Info className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center justify-between">
                  Moderator Controls
                  {isAuthenticated && (
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white">
                      Logout
                    </Button>
                  )}
                </DialogTitle>
              </DialogHeader>

              {!isAuthenticated ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    />
                    <Input
                      placeholder="Password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    />
                    {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
                  </div>
                  <Button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700">
                    Login
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Add Player Section */}
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">Add New Player</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Player Name"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      />
                      <Input
                        placeholder="Score"
                        type="number"
                        value={newPlayerScore}
                        onChange={(e) => setNewPlayerScore(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <Button onClick={addPlayer} className="w-full bg-green-600 hover:bg-green-700">
                      Add Player
                    </Button>
                  </div>

                  {/* Score Adjustment Section */}
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">Adjust Scores</h3>
                    <div className="space-y-2">
                      {sortedPlayers.map((player) => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                          <span className="text-white">{player.name}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => adjustScore(player.id, -10)}
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => adjustScore(player.id, 10)}
                              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Rank Changes Feed */}
        {rankChanges.length > 0 && (
          <div className="mb-8">
            <div className="space-y-2">
              {rankChanges.map((change) => (
                <div
                  key={change.id}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-green-300 animate-pulse"
                >
                  {change.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="space-y-2 p-6">
              {sortedPlayers.map((player, index) => {
                const rank = index + 1
                const isAnimating = animatingPlayers.has(player.id)

                return (
                  <Dialog key={player.id}>
                    <DialogTrigger asChild>
                      <div
                        className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-500 hover:bg-slate-700/50 ${
                          isAnimating ? "bg-green-500/20 scale-105 shadow-lg shadow-green-500/20" : "bg-slate-700/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getRankIcon(rank)}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${player.avatar}`}
                          >
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{player.name}</h3>
                          <p className="text-gray-400 text-sm">Rank #{rank}</p>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{player.score}</div>
                          <p className="text-gray-400 text-sm">points</p>
                        </div>
                      </div>
                    </DialogTrigger>

                    <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
                      <DialogHeader>
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${player.avatar}`}
                          >
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <DialogTitle className="text-white text-xl">{player.name}</DialogTitle>
                            <p className="text-gray-400">Rank #{rank}</p>
                          </div>
                        </div>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-700 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                              <Target className="w-4 h-4" />
                              <span className="text-sm">Score</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{player.score}</div>
                          </div>

                          <div className="bg-slate-700 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                              <Code className="w-4 h-4" />
                              <span className="text-sm">Projects</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{player.projects}</div>
                          </div>
                        </div>

                        <div className="bg-slate-700 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Joined</span>
                          </div>
                          <div className="text-white">{player.joinDate}</div>
                        </div>

                        <div className="bg-slate-700 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <User className="w-4 h-4" />
                            <span className="text-sm">About</span>
                          </div>
                          <p className="text-white text-sm">{player.bio}</p>
                        </div>

                        {player.streak > 0 && (
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                            🔥 {player.streak} day streak
                          </Badge>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
