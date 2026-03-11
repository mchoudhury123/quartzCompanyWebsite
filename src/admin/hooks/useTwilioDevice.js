import { useState, useRef, useCallback, useEffect } from 'react';
import { Device } from '@twilio/voice-sdk';

export default function useTwilioDevice() {
  const deviceRef = useRef(null);
  const connectionRef = useRef(null);

  const [deviceReady, setDeviceReady] = useState(false);
  const [callState, setCallState] = useState('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const initDevice = useCallback(async () => {
    try {
      const res = await fetch('/api/twilio-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: 'crm-admin' }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (deviceRef.current) {
        deviceRef.current.destroy();
      }

      const device = new Device(data.token, {
        codecPreferences: ['opus', 'pcmu'],
        enableRingingState: true,
      });

      device.on('registered', () => setDeviceReady(true));
      device.on('error', (err) => setError(err.message));
      device.on('tokenWillExpire', async () => {
        const refreshRes = await fetch('/api/twilio-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identity: 'crm-admin' }),
        });
        const refreshData = await refreshRes.json();
        if (refreshData.token) device.updateToken(refreshData.token);
      });

      await device.register();
      deviceRef.current = device;
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const makeCall = useCallback(async (toNumber, leadId) => {
    if (!deviceRef.current) {
      setError('Twilio device not initialized');
      return;
    }

    setCallState('connecting');
    setError(null);
    setCallDuration(0);
    setIsMuted(false);

    try {
      const call = await deviceRef.current.connect({
        params: {
          To: toNumber,
          leadId: leadId,
        },
      });

      connectionRef.current = call;

      call.on('ringing', () => setCallState('ringing'));

      call.on('accept', () => {
        setCallState('in-progress');
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
      });

      call.on('disconnect', () => {
        setCallState('disconnected');
        clearInterval(timerRef.current);
        connectionRef.current = null;
        setTimeout(() => setCallState('idle'), 3000);
      });

      call.on('cancel', () => {
        setCallState('idle');
        clearInterval(timerRef.current);
        connectionRef.current = null;
      });

      call.on('error', (err) => {
        setError(err.message);
        setCallState('idle');
        clearInterval(timerRef.current);
      });
    } catch (err) {
      setError(err.message);
      setCallState('idle');
    }
  }, []);

  const hangUp = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.disconnect();
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (connectionRef.current) {
      const newMuted = !connectionRef.current.isMuted();
      connectionRef.current.mute(newMuted);
      setIsMuted(newMuted);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
    };
  }, []);

  return {
    deviceReady,
    callState,
    isMuted,
    callDuration,
    error,
    initDevice,
    makeCall,
    hangUp,
    toggleMute,
  };
}
