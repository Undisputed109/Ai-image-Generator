class AIImageGenerator {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key');
        this.history = JSON.parse(localStorage.getItem('image_history') || '[]');
        this.currentImage = null;
        this.isGenerating = false;
        this.demoMode = !this.apiKey; // Enable demo mode if no API key
        
        this.initializeElements();
        this.bindEvents();
        this.checkApiKey();
        this.loadHistory();
        
        if (this.demoMode) {
            this.enableDemoMode();
        }
    }

    initializeElements() {
        // Main elements
        this.promptInput = document.getElementById('promptInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.loadingSection = document.getElementById('loadingSection');
        this.imageContainer = document.getElementById('imageContainer');
        this.imageActions = document.getElementById('imageActions');
        this.historySection = document.getElementById('historySection');
        this.historyGrid = document.getElementById('historyGrid');
        
        // Options
        this.imageSize = document.getElementById('imageSize');
        this.imageQuality = document.getElementById('imageQuality');
        this.imageStyle = document.getElementById('imageStyle');
        
        // Action buttons
        this.downloadBtn = document.getElementById('downloadBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.regenerateBtn = document.getElementById('regenerateBtn');
        
        // Modal elements
        this.apiKeyModal = document.getElementById('apiKeyModal');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
    }

    bindEvents() {
        // Main functionality
        this.generateBtn.addEventListener('click', () => this.generateImage());
        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateImage();
            }
        });

        // Action buttons
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.shareBtn.addEventListener('click', () => this.shareImage());
        this.regenerateBtn.addEventListener('click', () => this.regenerateImage());

        // Modal events
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        this.apiKeyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        });

        // Close modal when clicking outside
        this.apiKeyModal.addEventListener('click', (e) => {
            if (e.target === this.apiKeyModal) {
                this.hideModal();
            }
        });
    }

    enableDemoMode() {
        // Add demo mode indicator
        const header = document.querySelector('.header');
        const demoBanner = document.createElement('div');
        demoBanner.className = 'demo-banner';
        demoBanner.innerHTML = `
            <div class="demo-content">
                <i class="fas fa-flask"></i>
                <span>Demo Mode - No API Key Required</span>
                <button id="getApiKeyBtn" class="demo-btn">Get API Key</button>
            </div>
        `;
        header.appendChild(demoBanner);

        // Add demo banner styles
        const style = document.createElement('style');
        style.textContent = `
            .demo-banner {
                background: linear-gradient(45deg, #ff6b6b, #feca57);
                color: white;
                padding: 10px 20px;
                border-radius: 10px;
                margin-top: 20px;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            }
            .demo-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                font-weight: 600;
            }
            .demo-btn {
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid white;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.3s ease;
            }
            .demo-btn:hover {
                background: white;
                color: #ff6b6b;
            }
        `;
        document.head.appendChild(style);

        // Bind demo button
        document.getElementById('getApiKeyBtn').addEventListener('click', () => {
            this.showModal();
        });

        // Update placeholder text
        this.promptInput.placeholder = "Describe the image you want to generate... (Demo mode - uses placeholder images)";
        
        // Add some demo history
        this.addDemoHistory();
    }

    addDemoHistory() {
        const demoImages = [
            {
                url: 'https://picsum.photos/400/400?random=1',
                prompt: 'A futuristic cityscape with flying cars and neon lights'
            },
            {
                url: 'https://picsum.photos/400/400?random=4',
                prompt: 'A serene mountain lake at sunrise with mist rising from the water'
            },
            {
                url: 'https://picsum.photos/400/400?random=34',
                prompt: 'A cozy coffee shop interior with warm lighting and people working'
            },
            {
                url: 'https://picsum.photos/400/400?random=25',
                prompt: 'A cosmic scene with distant galaxies and colorful nebulae'
            },
            {
                url: 'https://picsum.photos/400/400?random=5',
                prompt: 'An enchanted forest with glowing mushrooms and fairy lights'
            }
        ];

        demoImages.forEach((item, index) => {
            const historyItem = {
                id: Date.now() + index,
                url: item.url,
                prompt: item.prompt,
                timestamp: new Date(Date.now() - (index * 86400000)).toISOString() // Spread out timestamps
            };
            this.history.unshift(historyItem);
        });

        localStorage.setItem('image_history', JSON.stringify(this.history));
        this.loadHistory();
    }

    checkApiKey() {
        if (!this.apiKey && !this.demoMode) {
            this.showModal();
        }
    }

    showModal() {
        this.apiKeyModal.style.display = 'block';
        this.apiKeyInput.focus();
    }

    hideModal() {
        this.apiKeyModal.style.display = 'none';
        this.apiKeyInput.value = '';
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            this.showMessage('Please enter your OpenAI API key', 'error');
            return;
        }

        if (!apiKey.startsWith('sk-')) {
            this.showMessage('Please enter a valid OpenAI API key', 'error');
            return;
        }

        this.apiKey = apiKey;
        this.demoMode = false;
        localStorage.setItem('openai_api_key', apiKey);
        this.hideModal();
        this.showMessage('API key saved successfully! Demo mode disabled.', 'success');
        
        // Remove demo banner
        const demoBanner = document.querySelector('.demo-banner');
        if (demoBanner) {
            demoBanner.remove();
        }
        
        // Update placeholder
        this.promptInput.placeholder = "Describe the image you want to generate... (e.g., 'A futuristic cityscape at sunset with flying cars')";
    }

    async generateImage() {
        const prompt = this.promptInput.value.trim();
        
        if (!prompt) {
            this.showMessage('Please enter a description for the image', 'error');
            return;
        }

        if (!this.apiKey && !this.demoMode) {
            this.showMessage('Please set your OpenAI API key first', 'error');
            this.showModal();
            return;
        }

        if (this.isGenerating) {
            return;
        }

        this.isGenerating = true;
        this.generateBtn.disabled = true;
        this.showLoading();

        try {
            if (this.demoMode) {
                // Demo mode - simulate API call
                await this.simulateImageGeneration(prompt);
            } else {
                // Real API call
                const response = await this.callOpenAIAPI(prompt);
                
                if (response.data && response.data[0] && response.data[0].url) {
                    const imageUrl = response.data[0].url;
                    this.displayImage(imageUrl, prompt);
                    this.addToHistory(imageUrl, prompt);
                    this.showMessage('Image generated successfully!', 'success');
                } else {
                    throw new Error('No image URL received from API');
                }
            }
        } catch (error) {
            console.error('Error generating image:', error);
            this.showMessage(`Error generating image: ${error.message}`, 'error');
        } finally {
            this.isGenerating = false;
            this.generateBtn.disabled = false;
            this.hideLoading();
        }
    }

    async simulateImageGeneration(prompt) {
        // Simulate realistic generation time (2-4 seconds)
        const delay = 2000 + Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Generate a more relevant placeholder image based on the prompt
        const imageUrl = this.generateRelevantPlaceholder(prompt);
        
        this.displayImage(imageUrl, prompt);
        this.addToHistory(imageUrl, prompt);
        
        if (this.demoMode) {
            this.showMessage('Demo image generated! Get an API key for real AI images.', 'success');
        } else {
            this.showMessage('Image generated successfully!', 'success');
        }
    }

    generateRelevantPlaceholder(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        // Define categories with multiple reliable image sources
        const categories = [
            {
                keywords: ['city', 'urban', 'building', 'skyscraper', 'street', 'futuristic', 'cyberpunk'],
                images: [
                    'https://picsum.photos/1024/1024?random=1',
                    'https://picsum.photos/1024/1024?random=2',
                    'https://picsum.photos/1024/1024?random=3'
                ]
            },
            {
                keywords: ['nature', 'forest', 'tree', 'mountain', 'lake', 'river', 'landscape', 'outdoor'],
                images: [
                    'https://picsum.photos/1024/1024?random=4',
                    'https://picsum.photos/1024/1024?random=5',
                    'https://picsum.photos/1024/1024?random=6'
                ]
            },
            {
                keywords: ['portrait', 'person', 'face', 'human', 'people', 'man', 'woman', 'child'],
                images: [
                    'https://picsum.photos/1024/1024?random=7',
                    'https://picsum.photos/1024/1024?random=8',
                    'https://picsum.photos/1024/1024?random=9'
                ]
            },
            {
                keywords: ['animal', 'pet', 'dog', 'cat', 'bird', 'wildlife', 'creature'],
                images: [
                    'https://picsum.photos/1024/1024?random=10',
                    'https://picsum.photos/1024/1024?random=11',
                    'https://picsum.photos/1024/1024?random=12'
                ]
            },
            {
                keywords: ['car', 'vehicle', 'automobile', 'transport', 'road', 'highway'],
                images: [
                    'https://picsum.photos/1024/1024?random=13',
                    'https://picsum.photos/1024/1024?random=14',
                    'https://picsum.photos/1024/1024?random=15'
                ]
            },
            {
                keywords: ['food', 'meal', 'restaurant', 'cooking', 'kitchen', 'dining'],
                images: [
                    'https://picsum.photos/1024/1024?random=16',
                    'https://picsum.photos/1024/1024?random=17',
                    'https://picsum.photos/1024/1024?random=18'
                ]
            },
            {
                keywords: ['art', 'painting', 'drawing', 'creative', 'artistic', 'canvas'],
                images: [
                    'https://picsum.photos/1024/1024?random=19',
                    'https://picsum.photos/1024/1024?random=20',
                    'https://picsum.photos/1024/1024?random=21'
                ]
            },
            {
                keywords: ['technology', 'computer', 'laptop', 'phone', 'digital', 'tech'],
                images: [
                    'https://picsum.photos/1024/1024?random=22',
                    'https://picsum.photos/1024/1024?random=23',
                    'https://picsum.photos/1024/1024?random=24'
                ]
            },
            {
                keywords: ['space', 'galaxy', 'planet', 'star', 'cosmic', 'astronaut'],
                images: [
                    'https://picsum.photos/1024/1024?random=25',
                    'https://picsum.photos/1024/1024?random=26',
                    'https://picsum.photos/1024/1024?random=27'
                ]
            },
            {
                keywords: ['ocean', 'sea', 'beach', 'water', 'marine', 'underwater'],
                images: [
                    'https://picsum.photos/1024/1024?random=28',
                    'https://picsum.photos/1024/1024?random=29',
                    'https://picsum.photos/1024/1024?random=30'
                ]
            },
            {
                keywords: ['flower', 'garden', 'plant', 'botanical', 'flora'],
                images: [
                    'https://picsum.photos/1024/1024?random=31',
                    'https://picsum.photos/1024/1024?random=32',
                    'https://picsum.photos/1024/1024?random=33'
                ]
            },
            {
                keywords: ['architecture', 'building', 'house', 'home', 'interior', 'design'],
                images: [
                    'https://picsum.photos/1024/1024?random=34',
                    'https://picsum.photos/1024/1024?random=35',
                    'https://picsum.photos/1024/1024?random=36'
                ]
            }
        ];

        // Find the best matching category
        let bestMatch = categories[0]; // Default to first category
        let maxMatches = 0;

        for (const category of categories) {
            let matches = 0;
            for (const keyword of category.keywords) {
                if (lowerPrompt.includes(keyword)) {
                    matches++;
                }
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatch = category;
            }
        }

        // Generate a consistent image selection based on the prompt
        const seed = this.hashCode(prompt);
        const imageIndex = Math.abs(seed) % bestMatch.images.length;
        
        return bestMatch.images[imageIndex];
    }

    hashCode(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    async callOpenAIAPI(prompt) {
        const size = this.imageSize.value;
        const quality = this.imageQuality.value;
        const style = this.imageStyle.value;

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: size,
                quality: quality,
                style: style
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    displayImage(imageUrl, prompt) {
        this.currentImage = { url: imageUrl, prompt: prompt };
        
        this.imageContainer.innerHTML = `
            <img src="${imageUrl}" alt="Generated image" class="generated-image fade-in-up">
        `;
        
        this.imageActions.style.display = 'flex';
        this.imageContainer.scrollIntoView({ behavior: 'smooth' });
    }

    showLoading() {
        this.loadingSection.style.display = 'block';
        this.imageActions.style.display = 'none';
    }

    hideLoading() {
        this.loadingSection.style.display = 'none';
    }

    clearInput() {
        this.promptInput.value = '';
        this.promptInput.focus();
    }

    downloadImage() {
        if (!this.currentImage) return;

        const link = document.createElement('a');
        link.href = this.currentImage.url;
        link.download = `ai-generated-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    shareImage() {
        if (!this.currentImage) return;

        if (navigator.share) {
            navigator.share({
                title: 'AI Generated Image',
                text: this.currentImage.prompt,
                url: this.currentImage.url
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(this.currentImage.url).then(() => {
                this.showMessage('Image URL copied to clipboard!', 'success');
            }).catch(() => {
                this.showMessage('Could not copy to clipboard', 'error');
            });
        }
    }

    regenerateImage() {
        if (this.currentImage) {
            this.promptInput.value = this.currentImage.prompt;
            this.generateImage();
        }
    }

    addToHistory(imageUrl, prompt) {
        const historyItem = {
            id: Date.now(),
            url: imageUrl,
            prompt: prompt,
            timestamp: new Date().toISOString()
        };

        this.history.unshift(historyItem);
        
        // Keep only last 20 items
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }

        localStorage.setItem('image_history', JSON.stringify(this.history));
        this.loadHistory();
    }

    loadHistory() {
        if (this.history.length === 0) {
            this.historySection.style.display = 'none';
            return;
        }

        this.historySection.style.display = 'block';
        this.historyGrid.innerHTML = '';

        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <img src="${item.url}" alt="History image" loading="lazy">
                <div class="prompt">${this.truncateText(item.prompt, 50)}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                this.loadFromHistory(item);
            });

            this.historyGrid.appendChild(historyItem);
        });
    }

    loadFromHistory(item) {
        this.currentImage = { url: item.url, prompt: item.prompt };
        this.displayImage(item.url, item.prompt);
        this.showMessage('Image loaded from history', 'success');
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        // Insert after header
        const header = document.querySelector('.header');
        header.parentNode.insertBefore(messageElement, header.nextSibling);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    // Utility method to clear history
    clearHistory() {
        this.history = [];
        localStorage.removeItem('image_history');
        this.loadHistory();
        this.showMessage('History cleared', 'success');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIImageGenerator();
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn && !generateBtn.disabled) {
            generateBtn.click();
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('apiKeyModal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
});

// Add some cool effects
document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect to header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add typing effect to placeholder
    const promptInput = document.getElementById('promptInput');
    if (promptInput) {
        const placeholder = promptInput.placeholder;
        let i = 0;
        
        const typeWriter = () => {
            if (i < placeholder.length) {
                promptInput.placeholder = placeholder.substring(0, i + 1);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}); 