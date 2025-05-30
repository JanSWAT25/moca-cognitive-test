// MoCA Test Implementation
class MoCATest {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 15;
        this.scores = {};
        this.maxScores = {
            trail: 1,
            memory: 5,
            attention: 6,
            serial7s: 3,
            vigilance: 1,
            language: 3,
            abstraction: 2,
            delayedRecall: 5,
            orientation: 6
        };
        this.initializeTest();
    }

    initializeTest() {
        this.updateProgress();
        this.showCurrentStep();
        this.attachEventListeners();
        this.initializeStepContent();
    }

    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.querySelector('.progress-info').textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }

    showCurrentStep() {
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.querySelector(`.step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Show/hide Previous button
        const prevBtn = document.querySelector('.nav-button[data-action="prev"]');
        if (prevBtn) {
            prevBtn.style.display = this.currentStep === 1 ? 'none' : '';
        }

        // Advanced Trail Making Test logic for Step 2
        if (this.currentStep === 2) {
            this.initializeAdvancedTrailTest();
        }
    }

    initializeStepContent() {
        // Initialize step-specific content
        if (this.currentStep === 2) {
            this.initializeTrailMaking();
        } else if (this.currentStep === 3) {
            this.initializeMemoryTest();
        }
        // Add more step initializations as needed
    }

    initializeTrailMaking() {
        const trailCanvas = document.getElementById('trailCanvas');
        if (!trailCanvas) return;

        // Create trail points
        const points = [
            { type: 'number', value: '1', x: 50, y: 50 },
            { type: 'letter', value: 'A', x: 150, y: 50 },
            { type: 'number', value: '2', x: 250, y: 50 },
            { type: 'letter', value: 'B', x: 350, y: 50 },
            { type: 'number', value: '3', x: 450, y: 50 },
            { type: 'letter', value: 'C', x: 550, y: 50 },
            { type: 'number', value: '4', x: 650, y: 50 },
            { type: 'letter', value: 'D', x: 750, y: 50 },
            { type: 'number', value: '5', x: 850, y: 50 },
            { type: 'letter', value: 'E', x: 950, y: 50 }
        ];

        points.forEach(point => {
            const pointElement = document.createElement('div');
            pointElement.className = `trail-point ${point.type}`;
            pointElement.textContent = point.value;
            pointElement.style.left = `${point.x}px`;
            pointElement.style.top = `${point.y}px`;
            trailCanvas.appendChild(pointElement);
        });
    }

    initializeMemoryTest() {
        const wordList = document.querySelector('.word-list');
        if (!wordList) return;

        // Add any memory test specific initialization here
        const words = ['LEG', 'COTTON', 'SCHOOL', 'TOMATO', 'WHITE'];
        wordList.innerHTML = words.map(word => `<div class="word-item">${word}</div>`).join('');
    }

    attachEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'next') {
                    this.nextStep();
                } else if (action === 'prev') {
                    this.previousStep();
                }
            });
        });

        // Score tracking
        document.querySelectorAll('.score-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateScore(e.target.dataset.test, e.target.value);
            });
        });
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateProgress();
            this.showCurrentStep();
            this.initializeStepContent();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateProgress();
            this.showCurrentStep();
            this.initializeStepContent();
        }
    }

    updateScore(testName, score) {
        this.scores[testName] = parseInt(score) || 0;
        this.updateTotalScore();
    }

    updateTotalScore() {
        let totalScore = 0;
        for (const [test, score] of Object.entries(this.scores)) {
            totalScore += score;
        }
        const scoreElem = document.getElementById('total-score');
        if (scoreElem) scoreElem.textContent = totalScore;
    }

    calculateEducationAdjustment(education) {
        // MoCA education adjustment
        if (education <= 12) {
            return 1;
        }
        return 0;
    }

    getFinalScore() {
        const totalScore = Object.values(this.scores).reduce((a, b) => a + b, 0);
        const educationAdjustment = this.calculateEducationAdjustment(
            parseInt(document.getElementById('education-years').value) || 0
        );
        return totalScore + educationAdjustment;
    }

    saveResults() {
        const results = {
            scores: this.scores,
            totalScore: this.getFinalScore(),
            timestamp: new Date().toISOString(),
            patientInfo: {
                education: document.getElementById('education-years').value,
                age: document.getElementById('age').value,
                gender: document.getElementById('gender').value,
                name: document.getElementById('patient-name').value
            }
        };

        // Save to localStorage
        localStorage.setItem('mocaResults', JSON.stringify(results));
        
        // You could also implement server-side saving here
        console.log('Test results saved:', results);
    }

    initializeAdvancedTrailTest() {
        // Click-based Trail Making Test logic with scoring and validation
        let currentTargetIndex = 0;
        let errorCount = 0;
        let isTestComplete = false;
        let lastPoint = null;
        let lines = [];
        let userPath = [];
        let canvas = document.getElementById('trailCanvas');
        if (!canvas) return;
        let ctx = canvas.getContext('2d');

        // Reset dashboard and feedback
        document.getElementById('currentTarget').textContent = 'Start at 1';
        document.getElementById('currentTarget').className = 'status-value status-progress';
        document.getElementById('progressCount').textContent = '0/10';
        document.getElementById('errorCount').textContent = '0';
        document.getElementById('elapsedTime').textContent = '00:00';
        document.getElementById('feedbackArea').style.display = 'none';
        document.getElementById('validateBtn').disabled = true;

        // Remove completed/current classes from points
        document.querySelectorAll('.trail-point').forEach(point => {
            point.classList.remove('completed', 'current');
        });

        // Remove old lines
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines = [];
        lastPoint = null;
        userPath = [];
        isTestComplete = false;
        currentTargetIndex = 0;
        errorCount = 0;

        const trailSequence = [
            {value: '1', type: 'number', id: 'point-1'},
            {value: 'A', type: 'letter', id: 'point-A'},
            {value: '2', type: 'number', id: 'point-2'},
            {value: 'B', type: 'letter', id: 'point-B'},
            {value: '3', type: 'number', id: 'point-3'},
            {value: 'C', type: 'letter', id: 'point-C'},
            {value: '4', type: 'number', id: 'point-4'},
            {value: 'D', type: 'letter', id: 'point-D'},
            {value: '5', type: 'number', id: 'point-5'},
            {value: 'E', type: 'letter', id: 'point-E'}
        ];

        // Attach click listeners to each point
        document.querySelectorAll('.trail-point').forEach((point, idx) => {
            point.onclick = function() {
                if (isTestComplete || userPath.length >= 10) return;
                // Draw line from lastPoint to this point
                if (lastPoint) {
                    drawLineBetweenPoints(lastPoint, point);
                }
                lastPoint = point;
                userPath.push(idx);
                point.classList.add('completed');
                document.getElementById('progressCount').textContent = `${userPath.length}/10`;
                updateCurrentTarget();
                // Check correctness for scoring
                if (idx !== userPath.length - 1) {
                    errorCount++;
                    document.getElementById('errorCount').textContent = errorCount;
                    // No feedback during the test
                } else {
                    // No feedback during the test
                }
                // Enable validation after 10 clicks
                if (userPath.length === 10) {
                    isTestComplete = true;
                    document.getElementById('validateBtn').disabled = false;
                    showFeedback('Sequence complete! Click Validate to see your score.', 'info');
                }
            };
        });

        function drawLineBetweenPoints(from, to) {
            // Get the center of each circle relative to the canvas
            const canvasRect = canvas.getBoundingClientRect();
            const fromRect = from.getBoundingClientRect();
            const toRect = to.getBoundingClientRect();
            const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;
            const toX = toRect.left + toRect.width / 2 - canvasRect.left;
            const toY = toRect.top + toRect.height / 2 - canvasRect.top;
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.strokeStyle = '#2986cc';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        function updateCurrentTarget() {
            document.querySelectorAll('.trail-point').forEach(point => {
                point.classList.remove('current');
            });
            if (userPath.length < trailSequence.length) {
                const targetElement = document.getElementById(trailSequence[userPath.length].id);
                targetElement.classList.add('current');
                document.getElementById('currentTarget').textContent = `Go to: ${trailSequence[userPath.length].value}`;
            } else {
                document.getElementById('currentTarget').textContent = 'Complete!';
                document.getElementById('currentTarget').className = 'status-value status-success';
            }
        }

        function showFeedback(message, type) {
            const feedbackArea = document.getElementById('feedbackArea');
            feedbackArea.innerHTML = `<strong>${message}</strong>`;
            feedbackArea.className = `feedback-area feedback-${type}`;
            feedbackArea.style.display = 'block';
            if (type === 'error') {
                feedbackArea.classList.add('shake');
                setTimeout(() => feedbackArea.classList.remove('shake'), 500);
            } else {
                feedbackArea.classList.add('bounce-in');
                setTimeout(() => feedbackArea.classList.remove('bounce-in'), 800);
            }
        }

        // Attach navigation button logic
        window.goToPreviousStep = () => {
            document.querySelector('.nav-button[data-action="prev"]').click();
        };
        window.goToNextStep = () => {
            document.querySelector('.nav-button[data-action="next"]').click();
        };

        // Attach global functions for controls
        window.clearTrail = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            lastPoint = null;
            lines = [];
            userPath = [];
            document.querySelectorAll('.trail-point').forEach(p => p.classList.remove('completed', 'current'));
            currentTargetIndex = 0;
            errorCount = 0;
            isTestComplete = false;
            document.getElementById('progressCount').textContent = '0/10';
            document.getElementById('errorCount').textContent = '0';
            document.getElementById('feedbackArea').style.display = 'none';
            document.getElementById('validateBtn').disabled = true;
            updateCurrentTarget();
        };
        window.showHint = function() { showFeedback('Follow the sequence: 1 → A → 2 → B → 3 → C → 4 → D → 5 → E', 'info'); };
        window.resetTest = window.clearTrail;
        window.validatePath = function() {
            // Score: count how many in userPath are in the correct order
            let correct = 0;
            for (let i = 0; i < trailSequence.length; i++) {
                if (userPath[i] === i) correct++;
            }
            let scoreMsg = `<div>Score: <strong>${correct}/10</strong></div>`;
            let errorMsg = `<div>Errors: <strong>${errorCount}</strong></div>`;
            let feedback = '';
            if (correct === 10) {
                feedback = '<div style="color:#27ae60;font-weight:600;">Perfect! You completed the sequence without mistakes.</div>';
            } else if (correct >= 7) {
                feedback = '<div style="color:#f39c12;font-weight:600;">Good job! Minor mistakes, but mostly correct.</div>';
            } else {
                feedback = '<div style="color:#e74c3c;font-weight:600;">Needs improvement. Try to follow the sequence more closely.</div>';
            }
            showFeedback(`${scoreMsg}${errorMsg}${feedback}`, 'info');
        };
    }
}

// Initialize the test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mocaTest = new MoCATest();
}); 