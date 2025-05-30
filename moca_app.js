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
        this.stepFiles = {
            2: 'moca_step2_trail.html',
            3: 'moca_step3_bed.html',
            4: 'moca_step4_clock.html',
            5: 'moca_step5_naming.html',
            6: 'moca_step6_memory.html',
            7: 'moca_step7_attention.html',
            8: 'moca_step8_vigilance.html',
            9: 'moca_step9_serial7s.html',
            10: 'moca_step10_language.html',
            11: 'moca_step11_fluency.html',
            12: 'moca_step12_abstraction.html',
            13: 'moca_step13_delayed_recall.html',
            14: 'moca_step14_orientation.html',
            15: 'moca_step15_final_score.html'
        };
        this.loadedSteps = {};
        this.initializeTest();
    }

    initializeTest() {
        // Initialize the test state
        this.updateProgress();
        this.showCurrentStep();
        this.attachEventListeners();
    }

    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.querySelector('.progress-info').textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }

    async showCurrentStep() {
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.querySelector(`.step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Dynamically load step content if needed
        if (this.stepFiles[this.currentStep] && !this.loadedSteps[this.currentStep]) {
            const container = currentStepElement.querySelector('.step-content');
            if (container) {
                try {
                    const response = await fetch(this.stepFiles[this.currentStep]);
                    if (response.ok) {
                        const html = await response.text();
                        // Extract content between <body> and </body> using regex
                        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                        if (bodyMatch && bodyMatch[1]) {
                            container.innerHTML = bodyMatch[1];
                            // Extract and execute <script> tags
                            const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
                            let match;
                            while ((match = scriptRegex.exec(bodyMatch[1])) !== null) {
                                const scriptTag = document.createElement('script');
                                scriptTag.text = match[1];
                                document.body.appendChild(scriptTag);
                            }
                        } else {
                            container.innerHTML = '<div style="color:red">Step content not found.</div>';
                        }
                        this.loadedSteps[this.currentStep] = true;
                    } else {
                        container.innerHTML = '<div style="color:red">Failed to load step content.</div>';
                    }
                } catch (e) {
                    container.innerHTML = '<div style="color:red">Error loading step content.</div>';
                }
            }
        }

        // Show/hide Previous button
        const prevBtn = document.querySelector('.nav-button[data-action="prev"]');
        if (prevBtn) {
            prevBtn.style.display = this.currentStep === 1 ? 'none' : '';
        }
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
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateProgress();
            this.showCurrentStep();
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