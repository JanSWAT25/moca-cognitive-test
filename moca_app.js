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
}

// Initialize the test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mocaTest = new MoCATest();
}); 