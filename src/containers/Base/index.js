import {useNavigate} from 'react-router-dom'
const Base = () => {
    const navigate = useNavigate();
    return (
        <div className="App">
            <div className="container">
                <button onClick={() => {
                    navigate('/simple')
                }}>Start simple response</button>
                <button onClick={() => {
                    navigate('/conversationList')
                }}>Go to conversation list</button>
            </div>
        </div>
    )
}

export default Base;