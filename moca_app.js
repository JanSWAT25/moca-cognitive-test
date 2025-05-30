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
        // Advanced JS logic from moca_step2_trail.html
        let canvas = document.getElementById('trailCanvas');
        if (!canvas) return;
        let ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentTargetIndex = 0;
        let pathPoints = [];
        let drawnPath = [];
        let testStartTime = null;
        let timerInterval = null;
        let errors = 0;
        let isTestComplete = false;

        // Remove any previous event listeners by cloning the canvas
        const newCanvas = canvas.cloneNode(true);
        canvas.parentNode.replaceChild(newCanvas, canvas);
        canvas = newCanvas;
        ctx = canvas.getContext('2d');

        // Reset dashboard and feedback
        document.getElementById('currentTarget').textContent = 'Start at 1';
        document.getElementById('currentTarget').className = 'status-value status-progress';
        document.getElementById('progressCount').textContent = '0/10';
        document.getElementById('errorCount').textContent = '0';
        document.getElementById('elapsedTime').textContent = '00:00';
        document.getElementById('feedbackArea').style.display = 'none';
        document.getElementById('validateBtn').disabled = true;

        // Remove old hint path
        const svg = document.getElementById('hintOverlay');
        if (svg) {
            while (svg.lastChild && svg.lastChild.nodeName === 'path') {
                svg.removeChild(svg.lastChild);
            }
        }

        // Remove completed/current classes from points
        document.querySelectorAll('.trail-point').forEach(point => {
            point.classList.remove('completed', 'current');
        });

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

        function initializeTrailTest() {
            setupDrawingEvents();
            updateCurrentTarget();
            generateHintPath();
            startTimer();
        }

        function setupDrawingEvents() {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);
            // Touch events for mobile
            canvas.addEventListener('touchstart', handleTouch);
            canvas.addEventListener('touchmove', handleTouch);
            canvas.addEventListener('touchend', stopDrawing);
        }

        function startDrawing(e) {
            if (isTestComplete) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (currentTargetIndex === 0) {
                const startPoint = getPointPosition(trailSequence[0].id);
                const distance = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
                if (distance > 30) {
                    showFeedback('Please start drawing from point 1', 'error');
                    incrementErrors();
                    return;
                }
                if (!testStartTime) {
                    testStartTime = Date.now();
                }
            }
            isDrawing = true;
            pathPoints = [{x, y}];
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#3498db';
        }

        function draw(e) {
            if (!isDrawing || isTestComplete) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            pathPoints.push({x, y});
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
            checkTargetReached(x, y);
        }

        function stopDrawing() {
            if (isDrawing) {
                isDrawing = false;
                ctx.beginPath();
                if (pathPoints.length > 0) {
                    drawnPath.push([...pathPoints]);
                    pathPoints = [];
                }
                document.getElementById('validateBtn').disabled = false;
            }
        }

        function handleTouch(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                            e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }

        function checkTargetReached(x, y) {
            if (currentTargetIndex >= trailSequence.length) return;
            const targetPoint = getPointPosition(trailSequence[currentTargetIndex].id);
            const distance = Math.sqrt(Math.pow(x - targetPoint.x, 2) + Math.pow(y - targetPoint.y, 2));
            if (distance < 25) {
                markPointCompleted(trailSequence[currentTargetIndex].id);
                currentTargetIndex++;
                updateCurrentTarget();
                updateProgress();
                if (currentTargetIndex >= trailSequence.length) {
                    completeTest();
                }
            }
        }

        function getPointPosition(pointId) {
            const element = document.getElementById(pointId);
            const rect = element.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            return {
                x: rect.left - canvasRect.left + rect.width / 2,
                y: rect.top - canvasRect.top + rect.height / 2
            };
        }

        function markPointCompleted(pointId) {
            const point = document.getElementById(pointId);
            point.classList.remove('current');
            point.classList.add('completed');
        }

        function updateCurrentTarget() {
            document.querySelectorAll('.trail-point').forEach(point => {
                point.classList.remove('current');
            });
            if (currentTargetIndex < trailSequence.length) {
                const targetElement = document.getElementById(trailSequence[currentTargetIndex].id);
                targetElement.classList.add('current');
                document.getElementById('currentTarget').textContent = 
                    `Go to: ${trailSequence[currentTargetIndex].value}`;
            } else {
                document.getElementById('currentTarget').textContent = 'Complete!';
                document.getElementById('currentTarget').className = 'status-value status-success';
            }
        }

        function updateProgress() {
            document.getElementById('progressCount').textContent = `${currentTargetIndex}/10`;
        }

        function incrementErrors() {
            errors++;
            document.getElementById('errorCount').textContent = errors;
        }

        function startTimer() {
            const startTime = Date.now();
            timerInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                document.getElementById('elapsedTime').textContent = timeString;
            }, 1000);
        }

        function generateHintPath() {
            const svg = document.getElementById('hintOverlay');
            if (!svg) return;
            let pathData = '';
            for (let i = 0; i < trailSequence.length - 1; i++) {
                const start = getPointPosition(trailSequence[i].id);
                const end = getPointPosition(trailSequence[i + 1].id);
                if (i === 0) {
                    pathData += `M ${start.x} ${start.y} `;
                }
                pathData += `L ${end.x} ${end.y} `;
            }
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', '#2ecc71');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('stroke-dasharray', '8,4');
            path.setAttribute('fill', 'none');
            path.setAttribute('marker-end', 'url(#arrowhead)');
            path.setAttribute('opacity', '0.8');
            svg.appendChild(path);
        }

        function toggleHint() {
            const hintOverlay = document.getElementById('hintOverlay');
            const hintBtn = document.getElementById('hintBtn');
            if (hintOverlay.classList.contains('visible')) {
                hintOverlay.classList.remove('visible');
                hintBtn.innerHTML = '💡 Show Hint';
            } else {
                hintOverlay.classList.add('visible');
                hintBtn.innerHTML = '👁️ Hide Hint';
                setTimeout(() => {
                    hintOverlay.classList.remove('visible');
                    hintBtn.innerHTML = '💡 Show Hint';
                }, 3000);
            }
        }

        function clearTrail() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawnPath = [];
            pathPoints = [];
            document.getElementById('validateBtn').disabled = true;
        }

        function resetTest() {
            clearTrail();
            currentTargetIndex = 0;
            errors = 0;
            isTestComplete = false;
            updateCurrentTarget();
            updateProgress();
            document.getElementById('errorCount').textContent = '0';
            document.getElementById('feedbackArea').style.display = 'none';
            document.getElementById('validateBtn').disabled = true;
        }

        function validatePath() {
            // For demo: just show success
            showFeedback('Path validated! (Demo only)', 'success');
            isTestComplete = true;
            document.getElementById('validateBtn').disabled = true;
        }

        function completeTest() {
            showFeedback('Test complete! Please validate your path.', 'info');
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
        window.clearTrail = clearTrail;
        window.toggleHint = toggleHint;
        window.resetTest = resetTest;
        window.validatePath = validatePath;

        // Initialize when Step 2 is shown
        setTimeout(initializeTrailTest, 100);
    }
}

// Initialize the test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mocaTest = new MoCATest();
}); 