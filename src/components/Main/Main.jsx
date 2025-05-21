import React, { useContext, useState } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, setImage, image, clearConversation } = useContext(Context)
    const [isRecording, setIsRecording] = useState(false)

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (input || image)) {
            console.log('Enter pressed:', { input, image: image ? 'Image present' : 'No image' }); // Debug
            onSent();
        }
    }

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle audio recording
    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition not supported in this browser.')
            return
        }

        const recognition = new window.webkitSpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => {
            setIsRecording(true)
        }

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript
            setInput(transcript)
            setIsRecording(false)
        }

        recognition.onerror = () => {
            setIsRecording(false)
            alert('Error occurred in speech recognition.')
        }

        recognition.onend = () => {
            setIsRecording(false)
        }

        if (isRecording) {
            recognition.stop()
        } else {
            recognition.start()
        }
    }

    return (
        <div className="main">
            <div className="nav">
                <p>ZORO AI</p>
                <img src="https://i.pinimg.com/originals/4f/94/78/4f9478d1df6f5ea14887fc89302f380b.jpg" alt="" />
            </div>
            <div className="main-container">
                {!showResult
                ? <>
                    <div className="greet">
                        <p><span>Hello, Dev</span></p>
                        <p>How can I help you today?</p>
                    </div>
                    <div className="cards">
                        <div className="card">
                            <p>Select beautiful places to see on an upcoming road trip</p>
                            <img src={assets.compass_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Briefly summarise the concept</p>
                            <img src={assets.bulb_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Brainstorm team bonding activities for our work retreat</p>
                            <img src={assets.message_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Improve the readability of the following code</p>
                            <img src={assets.code_icon} alt="" />
                        </div>
                    </div>
                </>
                : <div className='result'>
                    <div className="result-title">
                        <img src={assets.user_icon} alt="" />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className="result-data">
                        <img src={assets.gemini_icon} alt="" />
                        {loading
                        ? <div className='loader'>
                            <hr />
                            <hr />
                            <hr />
                        </div>
                        : <p dangerouslySetInnerHTML={{__html: resultData}}></p>
                        }
                    </div>
                </div>
                }
                <div className="main-bottom">
                    <div className="search-box">
                        <input 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder='Enter Prompt Here'
                            onKeyDown={handleKeyDown}
                        />
                        {image && <img src={image} alt="Selected" className="image-preview" />}
                        <div>
                            <label htmlFor="image-upload">
                                <img src={assets.gallery_icon} alt="Upload" />
                            </label>
                            <input 
                                id="image-upload" 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                            />
                            <img 
                                src={assets.mic_icon} 
                                alt="Microphone" 
                                onClick={handleMicClick} 
                                style={{ opacity: isRecording ? 0.5 : 1 }}
                            />
                            <img src={assets.message_icon} alt="" />
                            {input || image ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                            <button className="clear-button" onClick={clearConversation} title="Clear Conversation">×</button>
                        </div>
                    </div>
                    <p className="bottom-info">
                        ZORO AI may display inaccurate info, including about people, so double-check its responses. API Rights Reserved by © gemini ai.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main