/**
 * ============================================================
 * LAND GRAB GAME (땅따먹기 배틀!)
 * Player vs Computer Interactive Board Game
 * ============================================================
 */

// Sound Engine using Web Audio API (100% self-contained, no external audio files needed)
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playPlayerPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    // Bright bouncy pop sound (pitch sweeps up quickly)
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  playComputerBeep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    // Cute electronic bot blip (triangle wave)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.14);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  playWinFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.11;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  playLoseSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [392.0, 369.99, 329.63, 277.18]; // Descending notes
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.14;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.24);
    });
  }

  playDrawSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 440];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.27);
    });
  }
}

// Confetti Particle System for Victory Celebration
class ConfettiManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launch(duration = 3500) {
    this.stop();
    this.particles = [];
    const colors = ['#FF6B4A', '#FFA834', '#4A6CF7', '#00C6FF', '#10B981', '#F59E0B', '#EC4899'];
    const count = Math.min(120, Math.floor(window.innerWidth / 6));

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.4 - 100,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        velX: (Math.random() - 0.5) * 5,
        velY: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    const startTime = performance.now();
    const render = (currentTime) => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let p of this.particles) {
        p.x += p.velX;
        p.y += p.velY;
        p.rotation += p.rotSpeed;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();

        // Wrap or keep falling
        if (p.y > this.canvas.height) {
          p.y = -20;
          p.x = Math.random() * this.canvas.width;
        }
      }

      if (currentTime - startTime < duration) {
        this.animationId = requestAnimationFrame(render);
      } else {
        this.stop();
      }
    };

    this.animationId = requestAnimationFrame(render);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Main Game Controller
class LandGame {
  constructor() {
    this.gridSize = 5; // Default 5x5
    this.totalCells = 25;
    this.boardState = []; // Array of length totalCells: null | 'player' | 'computer'
    this.playerScore = 0;
    this.computerScore = 0;
    this.isAiTurn = false;
    this.isGameOver = false;

    // Subsystems
    this.sound = new SoundEngine();
    this.confetti = new ConfettiManager(document.getElementById('confettiCanvas'));

    // DOM Elements
    this.boardElement = document.getElementById('gameBoard');
    this.playerScoreElem = document.getElementById('playerScore');
    this.computerScoreElem = document.getElementById('computerScore');
    this.remainCellsElem = document.getElementById('remainCellsCount');
    this.playerCardElem = document.getElementById('playerCard');
    this.computerCardElem = document.getElementById('computerCard');
    this.turnBannerElem = document.getElementById('turnBanner');
    this.turnTextElem = document.getElementById('turnText');
    this.playerProgressBar = document.getElementById('playerProgressBar');
    this.computerProgressBar = document.getElementById('computerProgressBar');
    this.neutralProgressBar = document.getElementById('neutralProgressBar');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.restartBtn = document.getElementById('restartBtn');
    
    // Result Modal DOM
    this.resultModal = document.getElementById('resultModal');
    this.modalEmoji = document.getElementById('modalEmoji');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalDesc = document.getElementById('modalDesc');
    this.modalPlayerScore = document.getElementById('modalPlayerScore');
    this.modalComputerScore = document.getElementById('modalComputerScore');
    this.modalRestartBtn = document.getElementById('modalRestartBtn');

    // Intro & Rules Modal DOM
    this.introModal = document.getElementById('introModal');
    this.startGameBtn = document.getElementById('startGameBtn');
    this.introCloseBtn = document.getElementById('introCloseBtn');
    this.rulesBtn = document.getElementById('rulesBtn');

    // Size Selectors
    this.sizeButtons = document.querySelectorAll('.size-btn');

    this.bindEvents();
    this.startNewGame(this.gridSize);
  }

  bindEvents() {
    // Sound Toggle
    this.soundToggleBtn.addEventListener('click', () => {
      const isEnabled = this.sound.toggle();
      const iconSpan = this.soundToggleBtn.querySelector('.icon');
      iconSpan.textContent = isEnabled ? '🔊' : '🔇';
      this.soundToggleBtn.title = isEnabled ? '소리 끄기' : '소리 켜기';
    });

    // Reset Buttons
    this.restartBtn.addEventListener('click', () => this.startNewGame(this.gridSize));
    this.modalRestartBtn.addEventListener('click', () => {
      this.closeModal();
      this.startNewGame(this.gridSize);
    });

    // Intro & Rules Modal Events
    if (this.startGameBtn) {
      this.startGameBtn.addEventListener('click', () => {
        this.sound.init();
        this.sound.playPlayerPop();
        this.closeIntroModal();
      });
    }

    if (this.rulesBtn) {
      this.rulesBtn.addEventListener('click', () => {
        this.openIntroModal();
      });
    }

    if (this.introCloseBtn) {
      this.introCloseBtn.addEventListener('click', () => {
        this.closeIntroModal();
      });
    }

    if (this.introModal) {
      this.introModal.addEventListener('click', (e) => {
        if (e.target === this.introModal) {
          this.closeIntroModal();
        }
      });
    }

    // Grid Size Selectors
    this.sizeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const newSize = parseInt(e.target.dataset.size, 10);
        if (newSize && newSize !== this.gridSize) {
          this.sizeButtons.forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          this.startNewGame(newSize);
        }
      });
    });
  }

  startNewGame(size = 5) {
    this.gridSize = size;
    this.totalCells = size * size;
    this.boardState = new Array(this.totalCells).fill(null);
    this.playerScore = 0;
    this.computerScore = 0;
    this.isAiTurn = false;
    this.isGameOver = false;

    this.confetti.stop();
    this.closeModal();

    // Set CSS grid property
    this.boardElement.style.setProperty('--grid-size', this.gridSize);
    this.boardElement.classList.remove('ai-turn');

    // Render cells
    this.boardElement.innerHTML = '';
    for (let i = 0; i < this.totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', `${i + 1}번째 빈 칸`);
      
      // Click event
      cell.addEventListener('click', () => this.handleCellClick(i));
      this.boardElement.appendChild(cell);
    }

    this.updateUI();
    this.setTurnMessage('내 차례! 원하는 빈 칸을 터치하세요! ✨', false);
  }

  handleCellClick(index) {
    // Prevent action if AI turn, game over, or cell already taken
    if (this.isAiTurn || this.isGameOver || this.boardState[index] !== null) {
      return;
    }

    // 1. Claim cell for Player
    this.claimCell(index, 'player');
    this.sound.playPlayerPop();

    // 2. Check Game Over
    if (this.checkGameOver()) {
      return;
    }

    // 3. Switch to Computer Turn
    this.startAiTurn();
  }

  claimCell(index, owner) {
    this.boardState[index] = owner;
    const cell = this.boardElement.children[index];
    cell.classList.add('occupied', owner === 'player' ? 'player-cell' : 'computer-cell');
    
    // Set cute icon
    const iconSpan = document.createElement('span');
    iconSpan.className = 'cell-icon';
    iconSpan.textContent = owner === 'player' ? '🚩' : '🤖';
    cell.innerHTML = '';
    cell.appendChild(iconSpan);
    cell.setAttribute('aria-label', owner === 'player' ? '내 영토' : '컴퓨터 영토');

    if (owner === 'player') {
      this.playerScore++;
    } else {
      this.computerScore++;
    }

    this.updateUI();
  }

  startAiTurn() {
    this.isAiTurn = true;
    this.boardElement.classList.add('ai-turn');
    this.setTurnMessage('컴퓨터가 생각 중입니다... 🤔', true);

    // AI thinking delay (400ms ~ 750ms for realistic game feel)
    const thinkingTime = Math.floor(Math.random() * 350) + 400;

    setTimeout(() => {
      if (this.isGameOver) return;

      // Computer randomly selects one of the remaining empty cells
      const emptyIndices = [];
      for (let i = 0; i < this.totalCells; i++) {
        if (this.boardState[i] === null) {
          emptyIndices.push(i);
        }
      }

      if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        this.claimCell(randomIndex, 'computer');
        this.sound.playComputerBeep();
      }

      // Check if finished after AI move
      if (this.checkGameOver()) {
        return;
      }

      // Switch back to player
      this.isAiTurn = false;
      this.boardElement.classList.remove('ai-turn');
      this.setTurnMessage('내 차례! 원하는 빈 칸을 터치하세요! ✨', false);
    }, thinkingTime);
  }

  checkGameOver() {
    const remaining = this.totalCells - (this.playerScore + this.computerScore);
    if (remaining === 0) {
      this.isGameOver = true;
      this.isAiTurn = false;
      this.boardElement.classList.remove('ai-turn');
      
      setTimeout(() => {
        this.showResultModal();
      }, 500);

      return true;
    }
    return false;
  }

  updateUI() {
    // Score counts
    this.playerScoreElem.textContent = this.playerScore;
    this.computerScoreElem.textContent = this.computerScore;

    const remaining = this.totalCells - (this.playerScore + this.computerScore);
    this.remainCellsElem.textContent = remaining;

    // Progress bar ratios
    const playerPercent = (this.playerScore / this.totalCells) * 100;
    const computerPercent = (this.computerScore / this.totalCells) * 100;
    const neutralPercent = (remaining / this.totalCells) * 100;

    this.playerProgressBar.style.width = `${playerPercent}%`;
    this.computerProgressBar.style.width = `${computerPercent}%`;
    this.neutralProgressBar.style.width = `${neutralPercent}%`;

    // Turn Card active class
    if (this.isAiTurn) {
      this.playerCardElem.classList.remove('active');
      this.computerCardElem.classList.add('active');
    } else {
      this.playerCardElem.classList.add('active');
      this.computerCardElem.classList.remove('active');
    }
  }

  setTurnMessage(msg, isAi) {
    this.turnTextElem.textContent = msg;
    if (isAi) {
      this.turnBannerElem.classList.add('computer-turn');
    } else {
      this.turnBannerElem.classList.remove('computer-turn');
    }
  }

  showResultModal() {
    this.modalPlayerScore.textContent = `${this.playerScore}칸`;
    this.modalComputerScore.textContent = `${this.computerScore}칸`;

    this.modalTitle.className = 'modal-title';

    // 점수 비교 판정: 플레이어 점수가 높을 때 승리, 낮을 때 패배, 같을 때만 무승부
    if (this.playerScore > this.computerScore) {
      // 1. 플레이어 점수가 높을 때: 승리
      this.modalEmoji.textContent = '🏆';
      this.modalTitle.textContent = '🎉 승리하셨습니다!';
      this.modalTitle.classList.add('win');
      this.modalDesc.textContent = `플레이어 점수(${this.playerScore}칸)가 컴퓨터 점수(${this.computerScore}칸)보다 높아 승리했습니다!`;
      this.setTurnMessage('🏆 승리! 더 많은 영토를 차지했습니다!', false);
      this.sound.playWinFanfare();
      this.confetti.launch(4500);
    } else if (this.playerScore < this.computerScore) {
      // 2. 플레이어 점수가 낮을 때: 패배
      this.modalEmoji.textContent = '🤖';
      this.modalTitle.textContent = '😢 패배하셨습니다!';
      this.modalTitle.classList.add('lose');
      this.modalDesc.textContent = `플레이어 점수(${this.playerScore}칸)가 컴퓨터 점수(${this.computerScore}칸)보다 낮아 패배했습니다.`;
      this.setTurnMessage('😢 패배! 다음 판에 다시 도전하세요!', true);
      this.sound.playLoseSound();
    } else if (this.playerScore === this.computerScore) {
      // 3. 점수가 같을 때만: 무승부
      this.modalEmoji.textContent = '🤝';
      this.modalTitle.textContent = '팽팽한 무승부!';
      this.modalTitle.classList.add('draw');
      this.modalDesc.textContent = `플레이어와 컴퓨터의 점수가 ${this.playerScore}칸으로 서로 같아 무승부로 판정되었습니다.`;
      this.setTurnMessage('🤝 동점! 팽팽한 무승부입니다!', false);
      this.sound.playDrawSound();
    }

    this.resultModal.classList.add('show');
  }

  closeModal() {
    this.resultModal.classList.remove('show');
  }

  openIntroModal() {
    if (this.introModal) {
      this.introModal.classList.add('show');
    }
  }

  closeIntroModal() {
    if (this.introModal) {
      this.introModal.classList.remove('show');
    }
  }
}

// Initialize Game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.game = new LandGame();
});
