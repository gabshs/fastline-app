import { useState, useEffect } from 'react';
import { TVPanel } from '../components/TVPanel';
import { Tv, Key, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { deviceService } from '@/services';
import filaProLogo from '@/assets/images/logo.svg';

export function TVPanelPage() {
  const [deviceKey, setDeviceKey] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const [isPairing, setIsPairing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyFromUrl = params.get('key');
    console.log('🔑 Key from URL:', keyFromUrl);
    
    if (keyFromUrl) {
      console.log('✅ Using key from URL');
      setDeviceKey(keyFromUrl);
      localStorage.setItem('tv_device_key', keyFromUrl);
    } else {
      const storedKey = localStorage.getItem('tv_device_key');
      console.log('💾 Stored key from localStorage:', storedKey);
      
      if (storedKey) {
        // Validate that stored key looks like an API key (base64, longer than 6 chars)
        if (storedKey.length > 20) {
          console.log('✅ Using stored API key');
          setDeviceKey(storedKey);
        } else {
          console.log('⚠️ Stored key looks like pairing code, clearing...');
          localStorage.removeItem('tv_device_key');
        }
      }
    }
  }, []);

  const handleConnect = async () => {
    if (!inputKey.trim()) return;

    setIsPairing(true);
    setError(null);

    try {
      // Pair device using pairing code to get API key
      console.log('🔄 Pairing device with code:', inputKey.trim());
      const response = await deviceService.pairDevice({
        pairingCode: inputKey.trim(),
      });

      // Save API key
      const apiKey = response.apiKey;
      console.log('✅ Pairing successful! API Key received:', apiKey.substring(0, 10) + '...');
      setDeviceKey(apiKey);
      localStorage.setItem('tv_device_key', apiKey);
      
      const params = new URLSearchParams();
      params.set('key', apiKey);
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    } catch (err) {
      console.error('❌ Pairing error:', err);
      setError('Código inválido ou expirado. Verifique e tente novamente.');
    } finally {
      setIsPairing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!deviceKey) return;

    try {
      // Call backend to unpair the device
      console.log('🔌 Desvinculando dispositivo...');
      await deviceService.unpairSelf(deviceKey);
      console.log('✅ Dispositivo desvinculado com sucesso');
    } catch (err) {
      console.error('❌ Erro ao desvincular dispositivo:', err);
      // Continue with local cleanup even if backend call fails
    }

    // Clear local storage and state
    setDeviceKey('');
    setInputKey('');
    localStorage.removeItem('tv_device_key');
    window.history.pushState({}, '', window.location.pathname);
    
    console.log('🧹 Dados locais limpos. Dispositivo pronto para novo emparelhamento.');
  };

  if (deviceKey) {
    return (
      <>
        <TVPanel deviceKey={deviceKey} />
        {/* Hidden disconnect button - press ESC to show */}
        <button
          onClick={handleDisconnect}
          className="fixed bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
          title="Pressione para desconectar"
        >
          Desconectar
        </button>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1C2D] to-[#070F1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img 
              src={filaProLogo} 
              alt="FilaPro" 
              className="w-56 h-auto"
            />
          </div>
          <p className="text-slate-400 text-base">Configure o dispositivo para exibir as senhas</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-10">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tv className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Painel TV</h1>
          <p className="text-slate-500">Insira o código de emparelhamento</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="deviceKey" className="flex items-center mb-2 text-slate-700 font-medium">
              <Key className="w-4 h-4 mr-2" />
              Código de Emparelhamento
            </Label>
            <Input
              id="deviceKey"
              type="text"
              placeholder="Digite o código de 6 caracteres"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && !isPairing && handleConnect()}
              className="font-mono text-center text-2xl tracking-widest h-14 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              maxLength={6}
              disabled={isPairing}
            />
            <p className="text-xs text-slate-500 mt-2">
              Obtenha o código no painel administrativo
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            onClick={handleConnect}
            disabled={!inputKey.trim() || inputKey.length !== 6 || isPairing}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all mt-6"
          >
            {isPairing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              'Conectar Painel'
            )}
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">Como configurar:</h3>
          <ol className="text-sm text-slate-600 space-y-2">
            <li>1. Acesse o painel administrativo</li>
            <li>2. Vá em Dispositivos no menu lateral</li>
            <li>3. Clique em "Novo Painel TV"</li>
            <li>4. Copie o código de 6 caracteres gerado</li>
            <li>5. Cole o código aqui e clique em "Conectar Painel"</li>
          </ol>
          <p className="text-xs text-slate-500 mt-3">
            ⏱️ O código expira em 15 minutos
          </p>
        </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>© 2026 FilaPro. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
