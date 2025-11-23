class EduVisionApp {
    constructor() {
        this.recommender = new MLRecommender();
        this.initializeApp();
    }

    async initializeApp() {
        await this.recommender.loadData();
        
        this.setupEventListeners();
        
        console.log('EduVision AI is ready! 🚀');
    }

    setupEventListeners() {
        const form = document.getElementById('preferenceForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        this.showLoading();
        
        const userPreferences = this.getUserPreferences();
        
        setTimeout(() => {
            const learningPath = this.recommender.generateLearningSequence(userPreferences);
            
            this.displayResults(learningPath);
        }, 1000);
    }

    getUserPreferences() {
        return {
            interests: document.getElementById('interests').value
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0),
            difficulty: document.getElementById('difficulty').value,
            learningStyle: document.getElementById('learningStyle').value,
            availableTime: parseInt(document.getElementById('availableTime').value)
        };
    }

    showLoading() {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="loading">
                <h2>🤖 AI is generating your learning path...</h2>
                <p>Analyzing your preferences and selecting optimal resources</p>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
    }

    displayResults(data) {
        const resultsDiv = document.getElementById('results');
        
        let html = `
            <h2>🎯 Your Personalized Learning Path</h2>
            
            <div class="path-summary">
                <h3>📊 Learning Path Overview</h3>
                <p><strong>Total Resources:</strong> ${data.resourcesCount}</p>
                <p><strong>Total Estimated Time:</strong> ${data.totalEstimatedTime} minutes</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(100, (data.totalEstimatedTime / 240) * 100)}%"></div>
                </div>
                <p><small>Optimized with Machine Learning</small></p>
            </div>
            
            <div class="recommendations-list">
                <h3>📚 Recommended Resources:</h3>
        `;

        data.learningPath.forEach((resource, index) => {
            const progressWidth = (resource.similarityScore * 100);
            
            html += `
                <div class="recommendation">
                    <h3>${index + 1}. ${resource.title}</h3>
                    
                    <div class="meta-info">
                        <span class="meta-item">📚 ${resource.subject}</span>
                        <span class="meta-item">🎯 ${resource.difficulty}</span>
                        <span class="meta-item">⏱️ ${resource.estimatedTime} min</span>
                        <span class="meta-item">👤 ${this.getLearningStyleEmoji(resource.learningStyle)}</span>
                    </div>
                    
                    <p>${resource.description}</p>
                    
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressWidth}%"></div>
                    </div>
                    
                    <div class="similarity-score">
                        Match with your profile: <strong>${(resource.similarityScore * 100).toFixed(1)}%</strong>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        resultsDiv.innerHTML = html;
    }

    getLearningStyleEmoji(style) {
        const emojis = {
            'visual': '👁️ Visual',
            'kinesthetic': '🛠️ Hands-on', 
            'theoretical': '📚 Theoretical'
        };
        return emojis[style] || style;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EduVisionApp();
});
