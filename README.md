# AI Image Generator

A beautiful, modern web application that generates stunning images using OpenAI's DALL-E 3 API. Transform your ideas into visual masterpieces with just a text description!

## ✨ Features

- **🎨 High-Quality Image Generation**: Uses OpenAI's DALL-E 3 model for stunning results
- **📱 Modern & Responsive Design**: Beautiful UI that works on all devices
- **⚙️ Customizable Options**: Choose image size, quality, and style
- **💾 Image History**: Automatically saves your generated images locally
- **⬇️ Download & Share**: Easy download and sharing functionality
- **🔄 Regenerate**: Quickly regenerate images with the same prompt
- **⌨️ Keyboard Shortcuts**: Ctrl+Enter to generate, Escape to close modals
- **🔒 Secure**: API key stored locally, never sent to external servers

## 🚀 Quick Start

### Option 1: Try Demo Mode (No API Key Required)
1. **Open the Application**
   - Simply open `index.html` in your web browser
   - No server setup required!

2. **Test the Interface**
   - The app will automatically enter demo mode
   - Try all features with placeholder images
   - Experience the full interface without any setup

3. **Get Your OpenAI API Key** (when ready)
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

4. **Switch to Real Mode**
   - Enter your API key when prompted
   - Start generating real AI images!

### Option 2: Direct Setup
1. **Open the Application**
   - Simply open `index.html` in your web browser
   - No server setup required!

2. **Get Your OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

3. **Enter Your API Key**
   - The app will prompt you to enter your API key on first use
   - Your key is stored securely in your browser's local storage

4. **Start Generating!**
   - Enter a description of the image you want
   - Choose your preferred settings
   - Click "Generate Image" or press Ctrl+Enter

## 🎯 How to Use

### Basic Usage
1. **Describe Your Image**: Enter a detailed description of what you want to see
   - Example: "A futuristic cityscape at sunset with flying cars and neon lights"
   - Be specific for better results!

2. **Choose Settings**:
   - **Size**: Square (1024x1024), Landscape (1792x1024), or Portrait (1024x1792)
   - **Quality**: Standard or HD
   - **Style**: Vivid (more artistic) or Natural (more realistic)

3. **Generate**: Click the "Generate Image" button and wait for your masterpiece!

### Advanced Features

#### Image History
- All generated images are automatically saved to your browser
- Click on any image in the history to reload it
- History is limited to 20 images to save space

#### Image Actions
- **Download**: Save the generated image to your device
- **Share**: Share the image URL or use native sharing if available
- **Regenerate**: Create a new version with the same prompt

#### Keyboard Shortcuts
- `Ctrl + Enter`: Generate image
- `Escape`: Close modal dialogs
- `Ctrl + Enter` in textarea: Generate image

## 🎨 Image Generation Tips

### Writing Better Prompts
- **Be Specific**: "A red sports car on a mountain road at sunset" vs "a car"
- **Include Details**: Mention style, lighting, mood, colors
- **Use Adjectives**: "Majestic", "Serene", "Vibrant", "Mysterious"
- **Specify Art Style**: "Oil painting", "Digital art", "Photorealistic"

### Example Prompts
- "A serene Japanese garden with cherry blossoms in spring, soft morning light, watercolor style"
- "A steampunk airship flying over Victorian London, detailed mechanical parts, dramatic lighting"
- "A cozy coffee shop interior with warm lighting, people working on laptops, modern minimalist design"

## 🔧 Technical Details

### Requirements
- Modern web browser with JavaScript enabled
- OpenAI API key with DALL-E 3 access
- Internet connection for API calls

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### API Usage
- Uses OpenAI's DALL-E 3 model
- Images are generated at high resolution
- API calls are made directly from your browser
- No server-side processing required

## 🔒 Privacy & Security

- **Local Storage**: Your API key and image history are stored locally in your browser
- **No Server**: All processing happens in your browser, no data sent to external servers
- **Secure API**: Direct communication with OpenAI's secure API endpoints
- **No Tracking**: No analytics or tracking code included

## 💡 Troubleshooting

### Common Issues

**"Please enter your OpenAI API key"**
- Make sure you have a valid OpenAI API key
- Ensure the key starts with `sk-`
- Check that you have DALL-E 3 access enabled

**"Error generating image"**
- Check your internet connection
- Verify your API key is correct
- Ensure you have sufficient API credits
- Try a different prompt if the current one is blocked

**Images not loading**
- Check your internet connection
- Try refreshing the page
- Clear browser cache if needed

### API Limits
- OpenAI has rate limits and usage quotas
- Check your OpenAI dashboard for current usage
- Consider upgrading your plan for higher limits

## 🎨 Customization

The application is built with vanilla HTML, CSS, and JavaScript, making it easy to customize:

- **Colors**: Modify the CSS variables in `styles.css`
- **Layout**: Adjust the grid and flexbox properties
- **Features**: Add new functionality in `script.js`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application!

## 🙏 Acknowledgments

- OpenAI for providing the DALL-E 3 API
- Font Awesome for the beautiful icons
- Google Fonts for the Inter font family

---

**Happy Image Generating! 🎨✨** 
