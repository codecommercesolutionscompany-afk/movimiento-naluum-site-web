import { useContext } from 'react';
import { ContextJsonLoadContext } from '../../../context/context_json_load/context_json_load';
import './message_final.scss';

const MessageFinal = ({indexMessage}) => {
    const { message } = useContext(ContextJsonLoadContext);

    if (!Array.isArray(message) || typeof indexMessage !== 'number' || !message[indexMessage]) return null;

    const messageFinal = message[indexMessage];
    return (
        <div className='message_final__container' style={{ backgroundImage: `url(${messageFinal.image})` }}>
            <div className='message_final__overlay'></div>
            <div className='message_final__content'>
                <div className='message_final__text'>
                    <h1 className='message_final__title'>{messageFinal.title}</h1>
                    <h2 className='message_final__subtitle'>{messageFinal.subtitle}</h2>
                    <div className='message_final__description'>
                        <p>{messageFinal.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
 
export default MessageFinal;
