import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Undo2, Edit3, Upload, Settings, Download } from 'lucide-react';

export default function BasketballScoreboard() {
  const [homeScore, setHomeScore] = useState(0);
  const [visitorScore, setVisitorScore] = useState(0);
  const [period, setPeriod] = useState(1);
  const [gameTime, setGameTime] = useState(1200); // 20 minutes in seconds
  const [shotClock, setShotClock] = useState(30);
  const [homeFouls, setHomeFouls] = useState(0);
  const [visitorFouls, setVisitorFouls] = useState(0);
  const [homeTimeouts, setHomeTimeouts] = useState(2);
  const [visitorTimeouts, setVisitorTimeouts] = useState(2);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isShotClockRunning, setIsShotClockRunning] = useState(false);
  
  // Undo system
  const [history, setHistory] = useState([]);
  const [canUndo, setCanUndo] = useState(false);
  
  // Edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Import players mode
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  
  // Teams modal
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [teams, setTeams] = useState([
    { 
      id: 1, 
      name: '汪汪队', 
      logo: '🐂', 
      players: [
        '1-LYL',
        '2-Chen',
        '3-Ray',
        '8-Joey',
        '15-Tang',
        '45-Gusty',
        'Sunny',
        'Bo',
        'Michael',
        'Leslie',
        'Gao',
        'Daniel',
        'Zz',
        'Yang'
      ]
    },
    { 
      id: 2, 
      name: '帝王蟹', 
      logo: '🐅', 
      players: [
        '0-Chumeng',
        '2-Weihao',
        '5-Weiyu',
        '8-Zesheng',
        '10-Shenyue',
        '11-Yunli',
        '12-John',
        '17-Xiao',
        '18-Haowen',
        '20-Jiaxi',
        '23-Siqiao',
        '24-Jerry',
        '25-Chun',
        '30-Jeffrey',
        '55-Yuwen'
      ]
    },
    { 
      id: 3, 
      name: '皮皮虾', 
      logo: '🦅', 
      players: [
        '2-XX',
        '3-ZZ',
        '5-李同',
        '6-GC',
        '7-Daniel',
        '8-Mike',
        '12-YY',
        '14-WQ',
        '15-Gary',
        '31-Young',
        '34-CYAN',
        '233-JL'
      ]
    },
    { 
      id: 4, 
      name: '8PM', 
      logo: '🐺', 
      players: [
        'Vic',
        'T',
        'Mic',
        'Jayden',
        'Russ',
        'Stan',
        'Mcgee',
        'Bowen',
        'Kelton'
      ]
    },
    { 
      id: 5, 
      name: '鲤鱼王', 
      logo: '🦁', 
      players: [
        'Patrick',
        'Peter 1',
        'Bin',
        'Ming',
        'Max',
        'Yitu',
        'Richard',
        '阿亮',
        'CHL',
        'Peter 2'
      ]
    },
    { 
      id: 6, 
      name: '猪猪战队', 
      logo: '🐻', 
      players: [
        '4-汤泡饭',
        '5-小朱',
        '11-Kris',
        '15-Gao',
        '23-Jay',
        '28-靖宇',
        '99-Allen'
      ]
    },
    { 
      id: 7, 
      name: 'Admins', 
      logo: '🐉', 
      players: [
        '3-Andi',
        '4-Luis',
        '5-Han',
        '6-Leo',
        '7-Piero',
        '8-XiaoLiu',
        '13-Huang',
        '15-Ivan',
        '18-Sean',
        '23-Yi',
        '24-Stanley',
        '33-LIU',
        '34-Henry',
        '41-GSW'
      ]
    },
    { id: 8, name: '无名', logo: '🦈', players: [] }
  ]);
  const [homeTeamId, setHomeTeamId] = useState(1);
  const [visitorTeamId, setVisitorTeamId] = useState(2);
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [selectingFor, setSelectingFor] = useState('home'); // 'home' or 'visitor'
  
  // Team players modal
  const [showTeamPlayersModal, setShowTeamPlayersModal] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamPlayersText, setTeamPlayersText] = useState('');
  
  // Defaults modal
  const [showDefaultsModal, setShowDefaultsModal] = useState(false);
  const [defaultGameTime, setDefaultGameTime] = useState(1200); // 20 minutes
  const [defaultShotClock, setDefaultShotClock] = useState(30);

  // Game event log
  const [gameEventLog, setGameEventLog] = useState([]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Don't trigger shortcuts in edit mode or when typing in input fields
      if (isEditMode || event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
      
      if (event.key === '`') {
        event.preventDefault();
        setShotClock(defaultShotClock);
      } else if (event.key === '1') {
        event.preventDefault();
        setShotClock(5);
      } else if (event.key === '2') {
        event.preventDefault();
        setShotClock(10);
      } else if (event.key === '3') {
        event.preventDefault();
        setShotClock(15);
      } else if (event.key === '4') {
        event.preventDefault();
        setShotClock(20);
      } else if (event.key === '5') {
        event.preventDefault();
        setShotClock(25);
      } else if (event.key === '6') {
        event.preventDefault();
        setShotClock(30);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [defaultShotClock, isEditMode]);

  // Player stats - no upper limit
  const [homePlayers, setHomePlayers] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      name: '',
      fouls: 0,
      score: 0,
      scoreHistory: [] // Array to track individual scores
    }))
  );
  
  const [visitorPlayers, setVisitorPlayers] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      name: '',
      fouls: 0,
      score: 0,
      scoreHistory: [] // Array to track individual scores
    }))
  );

  // Fixed player display parameters - always show 9 players
  const getPlayerBoxHeight = () => {
    return 9 * 85 + 16; // Fixed height for exactly 9 players + padding
  };

  // Update player arrays when needed - removed maxPlayers dependency
  const expandPlayerArrays = () => {
    const currentLength = homePlayers.length;
    const newLength = currentLength + 10; // Expand by 10 when needed
    
    setHomePlayers(prev => {
      const newArray = Array.from({ length: newLength }, (_, i) => 
        prev[i] || { name: '', fouls: 0, score: 0, scoreHistory: [] }
      );
      return newArray;
    });
    setVisitorPlayers(prev => {
      const newArray = Array.from({ length: newLength }, (_, i) => 
        prev[i] || { name: '', fouls: 0, score: 0 }
      );
      return newArray;
    });
  };

  // Game clock timer
  useEffect(() => {
    let interval;
    if (isGameRunning && gameTime > 0) {
      interval = setInterval(() => {
        setGameTime(prev => Math.max(0, prev - 1));
        // Also decrease shot clock when game timer is running
        setShotClock(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameRunning, gameTime]);

  // Shot clock timer
  useEffect(() => {
    let interval;
    if (isShotClockRunning && shotClock > 0) {
      interval = setInterval(() => {
        setShotClock(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isShotClockRunning, shotClock]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveToHistory = (action, data) => {
    const newHistoryItem = {
      action,
      data,
      timestamp: Date.now(),
      previousState: {
        homeScore,
        visitorScore,
        homeFouls,
        visitorFouls,
        period,
        homeTimeouts,
        visitorTimeouts,
        homePlayers: [...homePlayers],
        visitorPlayers: [...visitorPlayers]
      }
    };
    setHistory(prev => [...prev, newHistoryItem]);
    setCanUndo(true);
    
    // Also add to game event log
    const timestamp = new Date().toLocaleTimeString();
    let logEntry = `Period ${period}, Remaining time ${formatTime(gameTime)}, `;
    
    if (action === 'teamScore') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      logEntry += `${teamName}, team score +${data.points}`;
    } else if (action === 'foul') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      logEntry += `${teamName}, team foul`;
    } else if (action === 'removeFoul') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      logEntry += `${teamName}, team foul removed`;
    } else if (action === 'timeout') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      logEntry += `${teamName}, timeout used`;
    } else if (action === 'addTimeout') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      logEntry += `${teamName}, timeout restored`;
    } else if (action === 'removePlayerFoul') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      const playerName = data.team === 'home' ? homePlayers[data.playerIndex]?.name : visitorPlayers[data.playerIndex]?.name;
      logEntry += `${teamName}, ${playerName}, foul removed`;
    } else if (action === 'period') {
      logEntry += `Period changed from ${data.from} to ${data.to}`;
    } else {
      return; // Don't log other actions like playerScore and playerFoul as they're already logged separately
    }
    
    setGameEventLog(prev => [...prev, logEntry]);
  };

  const undo = () => {
    if (history.length === 0) return;
    
    const lastAction = history[history.length - 1];
    const { previousState, action, data } = lastAction;
    
    // Log the undo operation
    let undoLogEntry = `Period ${period}, Remaining time ${formatTime(gameTime)}, `;
    
    if (action === 'playerScore') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      const playerName = data.team === 'home' ? homePlayers[data.playerIndex]?.name : visitorPlayers[data.playerIndex]?.name;
      undoLogEntry += `UNDO: ${teamName}, ${playerName}, score -${data.points}`;
    } else if (action === 'playerFoul') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      const playerName = data.team === 'home' ? homePlayers[data.playerIndex]?.name : visitorPlayers[data.playerIndex]?.name;
      undoLogEntry += `UNDO: ${teamName}, ${playerName}, foul removed`;
    } else if (action === 'teamScore') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      undoLogEntry += `UNDO: ${teamName}, team score -${data.points}`;
    } else if (action === 'foul') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      undoLogEntry += `UNDO: ${teamName}, team foul removed`;
    } else if (action === 'timeout') {
      const teamName = data.team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
      undoLogEntry += `UNDO: ${teamName}, timeout restored`;
    } else {
      undoLogEntry += `UNDO: ${action}`;
    }
    
    setGameEventLog(prev => [...prev, undoLogEntry]);
    
    // Restore previous state
    setHomeScore(previousState.homeScore);
    setVisitorScore(previousState.visitorScore);
    setHomeFouls(previousState.homeFouls);
    setVisitorFouls(previousState.visitorFouls);
    setPeriod(previousState.period);
    setHomeTimeouts(previousState.homeTimeouts);
    setVisitorTimeouts(previousState.visitorTimeouts);
    setHomePlayers(previousState.homePlayers);
    setVisitorPlayers(previousState.visitorPlayers);
    
    // Remove last action from history
    setHistory(prev => prev.slice(0, -1));
    setCanUndo(history.length > 1);
  };

  const updatePlayerInfo = (team, playerIndex, field, value) => {
    if (team === 'home') {
      setHomePlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { ...player, [field]: value } : player
      ));
    } else {
      setVisitorPlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { ...player, [field]: value } : player
      ));
    }
  };

  const updatePlayerScore = (team, playerIndex, newScore) => {
    const score = Math.max(0, parseInt(newScore) || 0);
    if (team === 'home') {
      setHomePlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { ...player, score } : player
      ));
    } else {
      setVisitorPlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { ...player, score } : player
      ));
    }
  };

  const updateTeamScore = (team, newScore) => {
    const score = Math.max(0, parseInt(newScore) || 0);
    if (team === 'home') {
      setHomeScore(score);
    } else {
      setVisitorScore(score);
    }
  };

  const updateGameTime = (newTime) => {
    const time = Math.max(0, parseInt(newTime) || 0);
    setGameTime(time);
  };

  const addSinglePlayer = (team) => {
    if (team === 'home') {
      const firstEmptyIndex = homePlayers.findIndex(player => player.name.trim() === '');
      if (firstEmptyIndex !== -1) {
        setHomePlayers(prev => prev.map((player, idx) => 
          idx === firstEmptyIndex ? { ...player, name: 'New Player' } : player
        ));
      }
    } else {
      const firstEmptyIndex = visitorPlayers.findIndex(player => player.name.trim() === '');
      if (firstEmptyIndex !== -1) {
        setVisitorPlayers(prev => prev.map((player, idx) => 
          idx === firstEmptyIndex ? { ...player, name: 'New Player' } : player
        ));
      }
    }
  };

  const importPlayers = (team) => {
    const names = importText.split('\n').filter(name => name.trim() !== '');
    
    // Expand arrays if needed
    if (names.length > homePlayers.length) {
      const newLength = Math.max(names.length + 10, homePlayers.length + 10);
      setHomePlayers(prev => Array.from({ length: newLength }, (_, i) => 
        prev[i] || { name: '', fouls: 0, score: 0 }
      ));
      setVisitorPlayers(prev => Array.from({ length: newLength }, (_, i) => 
        prev[i] || { name: '', fouls: 0, score: 0, scoreHistory: [] }
      ));
    }
    
    if (team === 'home') {
      setHomePlayers(prev => prev.map((player, idx) => ({
        ...player,
        name: names[idx] || '', // Clear name if no import data
        score: 0, // Reset score
        fouls: 0, // Reset fouls
        scoreHistory: [] // Reset score history
      })));
    } else {
      setVisitorPlayers(prev => prev.map((player, idx) => ({
        ...player,
        name: names[idx] || '', // Clear name if no import data
        score: 0, // Reset score
        fouls: 0, // Reset fouls
        scoreHistory: [] // Reset score history
      })));
    }
    setShowImportModal(false);
    setImportText('');
  };

  const saveDefaults = () => {
    setShowDefaultsModal(false);
  };

  const resetToDefaults = () => {
    setGameTime(defaultGameTime);
    setShotClock(defaultShotClock);
  };

  const addScore = (team, points) => {
    saveToHistory('teamScore', { team, points });
    if (team === 'home') {
      setHomeScore(prev => prev + points);
    } else {
      setVisitorScore(prev => prev + points);
    }
    // Reset shot clock on score
    setShotClock(defaultShotClock);
  };

  const addPlayerScore = (team, playerIndex, points) => {
    saveToHistory('playerScore', { team, playerIndex, points });
    
    // Log the scoring event
    const teamName = team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
    const playerName = team === 'home' ? homePlayers[playerIndex]?.name : visitorPlayers[playerIndex]?.name;
    const logEntry = `Period ${period}, Remaining time ${formatTime(gameTime)}, ${teamName}, ${playerName}, score ${points}`;
    setGameEventLog(prev => [...prev, logEntry]);
    
    if (team === 'home') {
      setHomePlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { 
          ...player, 
          score: player.score + points,
          scoreHistory: [...player.scoreHistory, points]
        } : player
      ));
      setHomeScore(prev => prev + points);
    } else {
      setVisitorPlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { 
          ...player, 
          score: player.score + points,
          scoreHistory: [...player.scoreHistory, points]
        } : player
      ));
      setVisitorScore(prev => prev + points);
    }
    // Reset shot clock on score
    setShotClock(defaultShotClock);
  };

  const addPlayerFoul = (team, playerIndex) => {
    saveToHistory('playerFoul', { team, playerIndex });
    
    // Log the foul event
    const teamName = team === 'home' ? (homeTeam?.name || 'Home Team') : (visitorTeam?.name || 'Visitor Team');
    const playerName = team === 'home' ? homePlayers[playerIndex]?.name : visitorPlayers[playerIndex]?.name;
    const logEntry = `Period ${period}, Remaining time ${formatTime(gameTime)}, ${teamName}, ${playerName}, foul`;
    setGameEventLog(prev => [...prev, logEntry]);
    
    if (team === 'home') {
      setHomePlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { ...player, fouls: Math.min(player.fouls + 1, 5) } : player
      ));
      setHomeFouls(prev => Math.min(prev + 1, 99));
    } else {
      setVisitorPlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { ...player, fouls: Math.min(player.fouls + 1, 5) } : player
      ));
      setVisitorFouls(prev => Math.min(prev + 1, 99));
    }
  };

  const removePlayerFoul = (team, playerIndex) => {
    saveToHistory('removePlayerFoul', { team, playerIndex });
    if (team === 'home') {
      setHomePlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { ...player, fouls: Math.max(player.fouls - 1, 0) } : player
      ));
      setHomeFouls(prev => Math.max(prev - 1, 0));
    } else {
      setVisitorPlayers(prev => prev.map((player, idx) => 
        idx === playerIndex ? { ...player, fouls: Math.max(player.fouls - 1, 0) } : player
      ));
      setVisitorFouls(prev => Math.max(prev - 1, 0));
    }
  };

  const addFoul = (team) => {
    saveToHistory('foul', { team });
    if (team === 'home') {
      setHomeFouls(prev => Math.min(prev + 1, 99));
    } else {
      setVisitorFouls(prev => Math.min(prev + 1, 99));
    }
  };

  const removeFoul = (team) => {
    saveToHistory('removeFoul', { team });
    if (team === 'home') {
      setHomeFouls(prev => Math.max(prev - 1, 0));
    } else {
      setVisitorFouls(prev => Math.max(prev - 1, 0));
    }
  };

  const consumeTimeout = (team) => {
    if (team === 'home' && homeTimeouts > 0) {
      saveToHistory('timeout', { team });
      setHomeTimeouts(prev => prev - 1);
    } else if (team === 'visitor' && visitorTimeouts > 0) {
      saveToHistory('timeout', { team });
      setVisitorTimeouts(prev => prev - 1);
    }
  };

  const restoreTimeout = (team) => {
    if (team === 'home' && homeTimeouts < 2) {
      saveToHistory('addTimeout', { team });
      setHomeTimeouts(prev => prev + 1);
    } else if (team === 'visitor' && visitorTimeouts < 2) {
      saveToHistory('addTimeout', { team });
      setVisitorTimeouts(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setHomeScore(0);
    setVisitorScore(0);
    setPeriod(1);
    setGameTime(defaultGameTime);
    setShotClock(defaultShotClock);
    setHomeFouls(0);
    setVisitorFouls(0);
    setHomeTimeouts(2);
    setVisitorTimeouts(2);
    setIsGameRunning(false);
    setIsShotClockRunning(false);
    setHomePlayers(prev => prev.map(player => ({ ...player, score: 0, fouls: 0, scoreHistory: [] })));
    setVisitorPlayers(prev => prev.map(player => ({ ...player, score: 0, fouls: 0, scoreHistory: [] })));
    setHistory([]);
    setCanUndo(false);
    setGameEventLog([]); // Clear event log on game reset
  };

  const exportGameStats = () => {
    const homeTeamName = homeTeam?.name || 'Home Team';
    const visitorTeamName = visitorTeam?.name || 'Visitor Team';
    
    let exportText = `${homeTeamName}\n`;
    
    // Add home team players with stats
    const homePlayersWithStats = homePlayers.filter(player => player.name.trim() !== '');
    homePlayersWithStats.forEach(player => {
      const scoreHistory = player.scoreHistory.length > 0 ? player.scoreHistory.join(' ') : 'No scores';
      exportText += `${player.name}, fouls: ${player.fouls}, total point: ${player.score}, score history: ${scoreHistory}\n`;
    });
    
    exportText += `\n${visitorTeamName}\n`;
    
    // Add visitor team players with stats
    const visitorPlayersWithStats = visitorPlayers.filter(player => player.name.trim() !== '');
    visitorPlayersWithStats.forEach(player => {
      const scoreHistory = player.scoreHistory.length > 0 ? player.scoreHistory.join(' ') : 'No scores';
      exportText += `${player.name}, fouls: ${player.fouls}, total point: ${player.score}, score history: ${scoreHistory}\n`;
    });
    
    // Add game summary
    exportText += `\nGame Summary:\n`;
    exportText += `Final Score: ${homeTeamName} ${homeScore} - ${visitorScore} ${visitorTeamName}\n`;
    exportText += `Period: ${period}\n`;
    exportText += `Time Remaining: ${formatTime(gameTime)}\n`;
    exportText += `Team Fouls: ${homeTeamName} ${homeFouls}, ${visitorTeamName} ${visitorFouls}\n`;
    
    // Add game event log
    if (gameEventLog.length > 0) {
      exportText += `\nGame Event Log:\n`;
      gameEventLog.forEach(event => {
        exportText += `${event}\n`;
      });
    }
    
    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `basketball-game-stats-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogoUpload = (teamId, event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTeams(prev => prev.map(team => 
          team.id === teamId ? { ...team, logo: e.target.result } : team
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewTeam = () => {
    if (teams.length >= 8) return; // Maximum 8 teams for tournament
    const newId = Math.max(...teams.map(t => t.id)) + 1;
    setTeams(prev => [...prev, { id: newId, name: `Team ${newId}`, logo: '⚽', players: [] }]);
  };

  const updateTeam = (teamId, field, value) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, [field]: value } : team
    ));
  };

  const openTeamPlayersModal = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    setEditingTeamId(teamId);
    setTeamPlayersText(team.players.join('\n'));
    setShowTeamPlayersModal(true);
  };

  const saveTeamPlayers = () => {
    const players = teamPlayersText.split('\n').filter(name => name.trim() !== '');
    setTeams(prev => prev.map(team => 
      team.id === editingTeamId ? { ...team, players } : team
    ));
    setShowTeamPlayersModal(false);
    setEditingTeamId(null);
    setTeamPlayersText('');
  };

  const deleteTeam = (teamId) => {
    if (teams.length <= 2) return; // Keep at least 2 teams
    
    setTeams(prev => prev.filter(team => team.id !== teamId));
    
    // If deleted team was selected, reset to first available team
    if (homeTeamId === teamId) {
      const remainingTeams = teams.filter(team => team.id !== teamId);
      setHomeTeamId(remainingTeams[0]?.id);
    }
    if (visitorTeamId === teamId) {
      const remainingTeams = teams.filter(team => team.id !== teamId);
      setVisitorTeamId(remainingTeams[1]?.id || remainingTeams[0]?.id);
    }
  };

  const selectTeam = (teamId) => {
    if (selectingFor === 'home') {
      setHomeTeamId(teamId);
    } else {
      setVisitorTeamId(teamId);
    }
    setShowTeamSelector(false);
  };

  const getTeamById = (id) => teams.find(team => team.id === id);
  const homeTeam = getTeamById(homeTeamId);
  const visitorTeam = getTeamById(visitorTeamId);

  const renderTeamLogo = (logo) => {
    if (logo && logo.startsWith('data:image/')) {
      return <img src={logo} alt="Team Logo" className="w-36 h-36 object-cover rounded-full" />;
    } else {
      return <div className="text-white text-6xl font-bold">{logo}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Defaults Modal */}
        {showDefaultsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4">Set Default Values</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Game Timer (seconds)
                  </label>
                  <input
                    type="number"
                    value={defaultGameTime}
                    onChange={(e) => setDefaultGameTime(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full border-2 border-gray-300 rounded px-3 py-2"
                    min="0"
                    placeholder="1200 (20 minutes)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {Math.floor(defaultGameTime / 60)}:{(defaultGameTime % 60).toString().padStart(2, '0')}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Shot Clock (seconds)
                  </label>
                  <input
                    type="number"
                    value={defaultShotClock}
                    onChange={(e) => setDefaultShotClock(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full border-2 border-gray-300 rounded px-3 py-2"
                    min="0"
                    placeholder="30"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Standard: 24 seconds (NBA), 30 seconds (FIBA)
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDefaultsModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={resetToDefaults}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply Now
                </button>
                <button
                  onClick={saveDefaults}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Defaults
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Players Modal */}
        {showTeamPlayersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center" style={{zIndex: 9999}}>
            <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">
                {teams.find(t => t.id === editingTeamId)?.name} Player List
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Enter player names, one per line:
              </p>
              <textarea
                value={teamPlayersText}
                onChange={(e) => setTeamPlayersText(e.target.value)}
                className="w-full h-48 border-2 border-gray-300 rounded p-3 text-sm resize-none"
                placeholder="Player 1&#10;Player 2&#10;Player 3&#10;..."
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowTeamPlayersModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTeamPlayers}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Players
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Selector Modal */}
        {showTeamSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] max-h-[70vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">
                Select {selectingFor === 'home' ? 'Home' : 'Visitor'} Team
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {teams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => selectTeam(team.id)}
                    className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 hover:bg-gray-50 transition-colors ${
                      (selectingFor === 'home' ? homeTeamId : visitorTeamId) === team.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectingFor === 'home' ? 'bg-red-600' : 'bg-orange-600'
                    }`}>
                      {team.logo && team.logo.startsWith('data:image/') ? (
                        <img src={team.logo} alt="Team Logo" className="w-14 h-14 object-cover rounded-full" />
                      ) : (
                        <div className="text-white text-xl font-bold">{team.logo}</div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-800 text-sm">
                        Team {teams.findIndex(t => t.id === team.id) + 1}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTeamSelector(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Teams Modal */}
        {showTeamsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-[700px] max-w-[95vw] max-h-[90vh] flex flex-col">
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
                <div className="grid grid-cols-2 gap-3">
                  {teams.map((team, index) => (
                    <div key={team.id} className="border-2 border-gray-300 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2 flex-1">
                          <button
                            onClick={() => openTeamPlayersModal(team.id)}
                            className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline"
                            title="Click to edit player list"
                          >
                            Team {index + 1}
                          </button>
                          <input
                            type="text"
                            value={team.name}
                            onChange={(e) => updateTeam(team.id, 'name', e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                            placeholder="Team Name"
                          />
                        </div>
                        {teams.length > 2 && (
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="text-red-600 hover:text-red-800 font-bold text-xs ml-2"
                          >
                            ✕ Delete
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                            {team.logo && team.logo.startsWith('data:image/') ? (
                              <img src={team.logo} alt="Team Logo" className="w-14 h-14 object-cover rounded-full" />
                            ) : (
                              <div className="text-white text-2xl font-bold">{team.logo}</div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoUpload(team.id, e)}
                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={addNewTeam}
                    disabled={teams.length >= 8}
                    className={`font-bold py-2 px-3 rounded-lg flex items-center gap-1 text-sm ${
                      teams.length >= 8 
                        ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    <Plus size={14} />
                    Add Team ({teams.length}/8)
                  </button>
                  <div className="text-xs text-gray-500">
                    Tournament teams: {teams.length}/8
                  </div>
                </div>
              </div>
              
              {/* Fixed Footer - Always Visible */}
              <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowTeamsModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowTeamsModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Teams
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Players Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] flex flex-col">
              <h3 className="text-xl font-bold mb-4">Import Player Names</h3>
              <p className="text-sm text-gray-600 mb-3">
                Enter player names, one per line:
              </p>
              
              {/* Preset Team Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Load Preset Teams:</p>
                <div className="grid grid-cols-4 gap-2">
                  {teams.map((team, index) => {
                    const hasPlayers = team.players && team.players.length > 0;
                    const displayName = team.name && team.name.trim() !== '' && team.name !== `Team ${team.id}` ? team.name : `Team ${index + 1}`;
                    return (
                      <button
                        key={team.id}
                        onClick={() => hasPlayers ? setImportText(team.players.join('\n')) : setImportText(`Player 1\nPlayer 2\nPlayer 3\nPlayer 4\nPlayer 5\nPlayer 6\nPlayer 7\nPlayer 8\nPlayer 9\nPlayer 10`)}
                        className={`px-2 py-1 text-xs text-white rounded ${
                          hasPlayers 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                        title={hasPlayers ? `${team.players.length} players saved` : 'No players saved - using default'}
                      >
                        {displayName}
                        {hasPlayers && <span className="ml-1 text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Game Teams */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Load from Current Game:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const currentHomePlayers = homePlayers
                        .filter(player => player.name.trim() !== '')
                        .map(player => player.name);
                      setImportText(currentHomePlayers.join('\n'));
                    }}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Load Home Team
                    {homePlayers.filter(p => p.name.trim() !== '').length > 0 && (
                      <span className="ml-1 text-xs">({homePlayers.filter(p => p.name.trim() !== '').length})</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const currentVisitorPlayers = visitorPlayers
                        .filter(player => player.name.trim() !== '')
                        .map(player => player.name);
                      setImportText(currentVisitorPlayers.join('\n'));
                    }}
                    className="px-3 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                  >
                    Load Visitor Team
                    {visitorPlayers.filter(p => p.name.trim() !== '').length > 0 && (
                      <span className="ml-1 text-xs">({visitorPlayers.filter(p => p.name.trim() !== '').length})</span>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Text Area */}
              <div className="flex-1 mb-4">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full h-48 border-2 border-gray-300 rounded p-3 text-sm resize-none"
                  placeholder={`P1\nP2\nP3\n...`}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => importPlayers('home')}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Import to Home
                </button>
                <button
                  onClick={() => importPlayers('visitor')}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Import to Visitor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Scoreboard */}
        <div className="grid grid-cols-10 gap-4 mb-6">
          {/* Home Team Player Stats */}
          <div className="col-span-2">
            <div className="bg-red-600 border-4 border-black p-0.5 rounded-lg overflow-hidden" style={{ height: `${getPlayerBoxHeight()}px` }}>
              <div className="h-full overflow-x-hidden overflow-y-auto">
                {homePlayers.filter(player => player.name.trim() !== '').map((player, originalIndex) => {
                  const actualIndex = homePlayers.findIndex(p => p === player);
                  return (
                    <div key={actualIndex} className="group hover:bg-red-500 rounded p-1 cursor-pointer transition-colors mb-0.5 border-b border-red-700 last:border-b-0 pb-1">
                      {/* Top Row: Player Name and Score */}
                      <div className="flex justify-between items-center mb-1">
                        <div className="relative flex-1 mr-2">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={player.name}
                              onChange={(e) => updatePlayerInfo('home', actualIndex, 'name', e.target.value)}
                              className="text-2xl font-bold bg-red-400 text-black rounded px-1 py-1 w-full"
                              placeholder="Player Name"
                            />
                          ) : (
                            <div className="text-2xl font-bold text-black bg-transparent">
                              {player.name}
                            </div>
                          )}
                          {/* Hover Score Buttons */}
                          {!isEditMode && (
                            <div className="absolute inset-0 bg-green-600 bg-opacity-95 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addPlayerScore('home', actualIndex, 1);
                                }}
                                className="bg-transparent hover:bg-red-900 text-white font-bold py-1 px-2 text-sm border-0"
                              >
                                +1
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addPlayerScore('home', actualIndex, 2);
                                }}
                                className="bg-transparent hover:bg-red-900 text-white font-bold py-1 px-2 text-sm border-0"
                              >
                                +2
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addPlayerScore('home', actualIndex, 3);
                                }}
                                className="bg-transparent hover:bg-red-900 text-white font-bold py-1 px-2 text-sm border-0"
                              >
                                +3
                              </button>
                            </div>
                          )}
                        </div>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={player.score}
                            onChange={(e) => updatePlayerScore('home', actualIndex, e.target.value)}
                            className="text-2xl font-bold bg-red-400 text-black rounded pl-1 pr-2 py-1 w-14 text-center"
                            min="0"
                          />
                        ) : (
                          <button 
                            onClick={() => addPlayerScore('home', actualIndex, 1)}
                            className="text-2xl font-bold hover:bg-red-400 rounded pl-1 pr-2 py-1 transition-colors"
                            title="Click to add 1 point"
                          >
                            {player.score}
                          </button>
                        )}
                      </div>
                      
                      {/* Bottom Row: Fouls and Score History */}
                      <div className="flex justify-between items-center">
                        {/* Fouls */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => removePlayerFoul('home', actualIndex)}
                            className="text-black hover:bg-red-400 rounded px-1"
                            disabled={player.fouls === 0}
                            title="Remove foul"
                          >
                            <Minus size={8} />
                          </button>
                          <div className="text-sm font-bold text-black min-w-[20px] text-center">
                            {player.fouls}
                          </div>
                          <button
                            onClick={() => addPlayerFoul('home', actualIndex)}
                            className="text-black hover:bg-red-400 rounded px-1"
                            disabled={player.fouls === 5}
                            title="Add foul"
                          >
                            <Plus size={8} />
                          </button>
                        </div>
                        
                        {/* Score History */}
                        <div className="text-sm text-black font-mono flex-1 text-right">
                          {player.scoreHistory.join(' ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Home Team Buttons */}
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  const currentHomePlayers = homePlayers
                    .filter(player => player.name.trim() !== '')
                    .map(player => player.name);
                  setImportText(currentHomePlayers.join('\n'));
                  setShowImportModal(true);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm"
              >
                <Edit3 size={14} />
                Edit Players
              </button>
              <button
                onClick={() => addSinglePlayer('home')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm"
              >
                <Plus size={14} />
                Add Player
              </button>
            </div>
          </div>

          {/* Center Scoreboard */}
          <div className="col-span-6 space-y-1">
            {/* Team Logos and Names */}
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <button
                  onClick={() => {
                    setSelectingFor('home');
                    setShowTeamSelector(true);
                  }}
                  className="w-36 h-36 mx-auto mb-2 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer border-4 border-transparent hover:border-gray-300"
                  title="Click to select home team"
                >
                  {homeTeam && renderTeamLogo(homeTeam.logo)}
                </button>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    setSelectingFor('visitor');
                    setShowTeamSelector(true);
                  }}
                  className="w-36 h-36 mx-auto mb-2 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer border-4 border-transparent hover:border-gray-300"
                  title="Click to select visitor team"
                >
                  {visitorTeam && renderTeamLogo(visitorTeam.logo)}
                </button>
              </div>
            </div>

            {/* Main Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-600 border-4 border-black p-0 rounded-lg text-center">
                {isEditMode ? (
                  <input
                    type="number"
                    value={homeScore}
                    onChange={(e) => updateTeamScore('home', e.target.value)}
                    className="font-mono font-bold text-black bg-red-500 rounded px-1 py-1 w-full text-center"
                    style={{fontSize: '144px', lineHeight: '1'}}
                    min="0"
                  />
                ) : (
                  <div className="font-mono font-bold text-black" style={{fontSize: '144px', lineHeight: '1'}}>
                    {homeScore}
                  </div>
                )}
              </div>
              <div className="bg-orange-700 border-4 border-black p-0 rounded-lg text-center">
                {isEditMode ? (
                  <input
                    type="number"
                    value={visitorScore}
                    onChange={(e) => updateTeamScore('visitor', e.target.value)}
                    className="font-mono font-bold text-white bg-orange-600 rounded px-1 py-1 w-full text-center"
                    style={{fontSize: '144px', lineHeight: '1'}}
                    min="0"
                  />
                ) : (
                  <div className="font-mono font-bold text-white" style={{fontSize: '144px', lineHeight: '1'}}>
                    {visitorScore}
                  </div>
                )}
              </div>
            </div>

            {/* Game Clock */}
            <div className="bg-red-600 border-4 border-black p-0 rounded-lg">
              {isEditMode ? (
                <input
                  type="number"
                  value={gameTime}
                  onChange={(e) => updateGameTime(e.target.value)}
                  className="font-mono font-bold text-black bg-red-500 rounded px-1 py-1 w-full text-center"
                  style={{fontSize: '144px', lineHeight: '1'}}
                  min="0"
                  placeholder="Seconds"
                />
              ) : (
                <button
                  onClick={() => setIsGameRunning(!isGameRunning)}
                  className="text-center font-mono font-bold text-black w-full hover:bg-red-500 transition-colors rounded"
                  style={{fontSize: '144px', lineHeight: '1'}}
                  title={isGameRunning ? 'Click to pause timer' : 'Click to start timer'}
                >
                  {formatTime(gameTime)}
                </button>
              )}
            </div>

            {/* Game Controls */}
            <div className="grid grid-cols-5 gap-2 text-center">
              {/* Home Fouls */}
              <div className="bg-red-600 border-2 border-black p-2 rounded">
                <div className="text-xs font-bold text-black mb-1">FOULS</div>
                <div className="flex justify-center items-center space-x-2">
                  <button 
                    onClick={() => removeFoul('home')}
                    className="text-black hover:bg-red-700 rounded px-1"
                    disabled={homeFouls === 0}
                    title="Remove foul"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="text-4xl font-mono font-bold text-black">{homeFouls}</div>
                  <button 
                    onClick={() => addFoul('home')}
                    className="text-black hover:bg-red-700 rounded px-1"
                    disabled={homeFouls === 99}
                    title="Add foul"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Home Timeouts */}
              <div className="bg-gray-600 p-2 rounded">
                <div className="text-xs font-bold text-white mb-1">TIME OUT</div>
                <div className="flex justify-center items-center space-x-2">
                  <button 
                    onClick={() => restoreTimeout('home')}
                    className="text-white hover:bg-gray-700 rounded px-1"
                    disabled={homeTimeouts === 2}
                    title="Add timeout back"
                  >
                    <Minus size={20} />
                  </button>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full ${i < (2 - homeTimeouts) ? 'bg-black' : 'bg-white'}`}></div>
                  ))}
                  <button 
                    onClick={() => consumeTimeout('home')}
                    className="text-white hover:bg-gray-700 rounded px-1"
                    disabled={homeTimeouts === 0}
                    title="Use timeout"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Period */}
              <div className="bg-red-600 border-2 border-black p-2 rounded">
                <div className="text-xs font-bold text-black mb-1">PERIOD</div>
                <div className="flex justify-center items-center space-x-2">
                  <div className="text-2xl font-mono font-bold text-black">{period}</div>
                  <button onClick={() => {
                    saveToHistory('period', { from: period, to: Math.min(period + 1, 4) });
                    setPeriod(prev => Math.min(prev + 1, 4));
                    // Reset for new period
                    setHomeFouls(0);
                    setVisitorFouls(0);
                    setHomeTimeouts(2);
                    setVisitorTimeouts(2);
                    setGameTime(defaultGameTime);
                    setShotClock(defaultShotClock);
                  }} className="bg-red-700 hover:bg-red-800 text-white rounded px-1" title="Next period">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Visitor Timeouts */}
              <div className="bg-gray-600 p-2 rounded">
                <div className="text-xs font-bold text-white mb-1">TIME OUT</div>
                <div className="flex justify-center items-center space-x-2">
                  <button 
                    onClick={() => restoreTimeout('visitor')}
                    className="text-white hover:bg-gray-700 rounded px-1"
                    disabled={visitorTimeouts === 2}
                    title="Add timeout back"
                  >
                    <Minus size={20} />
                  </button>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full ${i < (2 - visitorTimeouts) ? 'bg-black' : 'bg-white'}`}></div>
                  ))}
                  <button 
                    onClick={() => consumeTimeout('visitor')}
                    className="text-white hover:bg-gray-700 rounded px-1"
                    disabled={visitorTimeouts === 0}
                    title="Use timeout"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Visitor Fouls */}
              <div className="bg-orange-700 border-2 border-black p-2 rounded">
                <div className="text-xs font-bold text-white mb-1">FOULS</div>
                <div className="flex justify-center items-center space-x-2">
                  <button 
                    onClick={() => removeFoul('visitor')}
                    className="text-white hover:bg-orange-800 rounded px-1"
                    disabled={visitorFouls === 0}
                    title="Remove foul"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="text-4xl font-mono font-bold text-white">{visitorFouls}</div>
                  <button 
                    onClick={() => addFoul('visitor')}
                    className="text-white hover:bg-orange-800 rounded px-1"
                    disabled={visitorFouls === 99}
                    title="Add foul"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Shot Clock Quick Set Buttons */}
            <div className="bg-red-600 border-2 border-black rounded">
              <div className="flex justify-center space-x-1 p-0">
                <button
                  onClick={() => setShotClock(5)}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded-sm text-sm"
                >
                  5s
                </button>
                <button
                  onClick={() => setShotClock(10)}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded-sm text-sm"
                >
                  10s
                </button>
                <button
                  onClick={() => setShotClock(15)}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded-sm text-sm"
                >
                  15s
                </button>
                <button
                  onClick={() => setShotClock(20)}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded-sm text-sm"
                >
                  20s
                </button>
                <button
                  onClick={() => setShotClock(25)}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded-sm text-sm"
                >
                  25s
                </button>
              </div>
            </div>

            {/* Shot Clock */}
            <div className="bg-red-600 border-4 border-black p-0 rounded text-center">
              <button
                onClick={() => setShotClock(defaultShotClock)}
                className="font-mono font-bold text-black w-full hover:bg-red-500 transition-colors rounded-sm"
                style={{fontSize: '144px', lineHeight: '1'}}
                title="Click to reset shot clock (or press ` key)"
              >
                {shotClock}
              </button>
            </div>

            {/* Game Controls */}
            <div className="flex justify-center space-x-2">
              <button 
                onClick={() => setShowTeamsModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1 text-sm"
              >
                <Plus size={16} />
                Teams
              </button>
              <button 
                onClick={exportGameStats}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1 text-sm"
              >
                <Download size={16} />
                Export Stats
              </button>
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`${isEditMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1 text-sm`}
              >
                <Edit3 size={16} />
                {isEditMode ? 'Exit Edit' : 'Edit Mode'}
              </button>
              <button 
                onClick={() => setShowDefaultsModal(true)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1 text-sm"
              >
                <Settings size={16} />
                Defaults
              </button>
              <button 
                onClick={undo}
                disabled={!canUndo || isEditMode}
                className={`${canUndo && !isEditMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1 transition-colors text-sm`}
              >
                <Undo2 size={16} />
                Undo
              </button>
              <button 
                onClick={resetGame}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1 text-sm"
                disabled={isEditMode}
              >
                <RotateCcw size={16} />
                Reset Game
              </button>
            </div>
          </div>

          {/* Visitor Team Player Stats */}
          <div className="col-span-2">
            <div className="bg-orange-700 border-4 border-black p-0.5 rounded-lg overflow-hidden" style={{ height: `${getPlayerBoxHeight()}px` }}>
              <div className="h-full overflow-x-hidden overflow-y-auto">
                {visitorPlayers.filter(player => player.name.trim() !== '').map((player, originalIndex) => {
                  const actualIndex = visitorPlayers.findIndex(p => p === player);
                  return (
                    <div key={actualIndex} className="group hover:bg-orange-600 rounded p-1 cursor-pointer transition-colors mb-0.5 border-b border-orange-800 last:border-b-0 pb-1">
                      {/* Top Row: Player Name and Score */}
                      <div className="flex justify-between items-center mb-1">
                        <div className="relative flex-1 mr-2">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={player.name}
                              onChange={(e) => updatePlayerInfo('visitor', actualIndex, 'name', e.target.value)}
                              className="text-2xl font-bold bg-orange-500 text-white rounded px-1 py-1 w-full"
                              placeholder="Player Name"
                            />
                          ) : (
                            <div className="text-2xl font-bold text-white bg-transparent">
                              {player.name}
                            </div>
                          )}
                          {/* Hover Score Buttons */}
                          {!isEditMode && (
                            <div className="absolute inset-0 bg-red-600 bg-opacity-95 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addPlayerScore('visitor', actualIndex, 1);
                                }}
                                className="bg-transparent hover:bg-orange-900 text-white font-bold py-1 px-2 text-sm border-0"
                              >
                                +1
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addPlayerScore('visitor', actualIndex, 2);
                                }}
                                className="bg-transparent hover:bg-orange-900 text-white font-bold py-1 px-2 text-sm border-0"
                              >
                                +2
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addPlayerScore('visitor', actualIndex, 3);
                                }}
                                className="bg-transparent hover:bg-orange-900 text-white font-bold py-1 px-2 text-sm border-0"
                              >
                                +3
                              </button>
                            </div>
                          )}
                        </div>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={player.score}
                            onChange={(e) => updatePlayerScore('visitor', actualIndex, e.target.value)}
                            className="text-2xl font-bold bg-orange-500 text-white rounded pl-1 pr-2 py-1 w-14 text-center"
                            min="0"
                          />
                        ) : (
                          <button 
                            onClick={() => addPlayerScore('visitor', actualIndex, 1)}
                            className="text-2xl font-bold hover:bg-orange-500 rounded pl-1 pr-2 py-1 transition-colors"
                            title="Click to add 1 point"
                          >
                            {player.score}
                          </button>
                        )}
                      </div>
                      
                      {/* Bottom Row: Fouls and Score History */}
                      <div className="flex justify-between items-center">
                        {/* Fouls */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => removePlayerFoul('visitor', actualIndex)}
                            className="text-white hover:bg-orange-500 rounded px-1"
                            disabled={player.fouls === 0}
                            title="Remove foul"
                          >
                            <Minus size={8} />
                          </button>
                          <div className="text-sm font-bold text-white min-w-[20px] text-center">
                            {player.fouls}
                          </div>
                          <button
                            onClick={() => addPlayerFoul('visitor', actualIndex)}
                            className="text-white hover:bg-orange-500 rounded px-1"
                            disabled={player.fouls === 5}
                            title="Add foul"
                          >
                            <Plus size={8} />
                          </button>
                        </div>
                        
                        {/* Score History */}
                        <div className="text-sm text-white font-mono flex-1 text-right">
                          {player.scoreHistory.join(' ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Visitor Team Buttons */}
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  const currentVisitorPlayers = visitorPlayers
                    .filter(player => player.name.trim() !== '')
                    .map(player => player.name);
                  setImportText(currentVisitorPlayers.join('\n'));
                  setShowImportModal(true);
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm"
              >
                <Edit3 size={14} />
                Edit Players
              </button>
              <button
                onClick={() => addSinglePlayer('visitor')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm"
              >
                <Plus size={14} />
                Add Player
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}