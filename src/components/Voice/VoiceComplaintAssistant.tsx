import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Pause, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

export function VoiceComplaintAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition();
  
  const { speak, isSpeaking, cancel } = useSpeechSynthesis();

  const handleStartRecording = () => {
    setIsRecording(true);
    startListening();
    setComplaintText(transcript || '');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopListening();
    setComplaintText(transcript || '');
  };

  const handlePlayback = () => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(complaintText);
    }
  };

  const handleSaveComplaint = () => {
    if (!complaintText.trim()) {
      toast({
        title: "No Content",
        description: "Please record or type a complaint first.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage (simulating backend)
    const complaints = JSON.parse(localStorage.getItem('voiceComplaints') || '[]');
    const newComplaint = {
      id: Date.now().toString(),
      text: complaintText,
      timestamp: new Date().toISOString(),
      method: 'voice',
      status: 'pending'
    };
    
    complaints.push(newComplaint);
    localStorage.setItem('voiceComplaints', JSON.stringify(complaints));
    
    toast({
      title: "Complaint Saved",
      description: "Voice complaint has been recorded and saved successfully.",
    });
    
    setComplaintText('');
    resetTranscript();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Voice Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Mic className="h-6 w-6 text-white" />
        </Button>
      </motion.div>

      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-6 bottom-24 z-50 w-96 h-[500px]"
          >
            <Card className="h-full shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader className="pb-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className="h-5 w-5" />
                    <CardTitle className="text-lg">Voice Assistant</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isRecording && (
                      <Badge variant="secondary" className="bg-red-500 text-white border-0 animate-pulse">
                        🔴 Recording
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-4">
                <div className="flex-1 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Record your complaint using voice or type it manually
                    </p>
                    
                    {/* Recording Controls */}
                    <div className="flex justify-center space-x-4 mb-4">
                      <Button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        className={`${
                          isRecording 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                      
                      {complaintText && (
                        <Button
                          variant="outline"
                          onClick={handlePlayback}
                        >
                          {isSpeaking ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Complaint Text Area */}
                  <div className="flex-1">
                    <Textarea
                      value={complaintText || transcript}
                      onChange={(e) => setComplaintText(e.target.value)}
                      placeholder="Your complaint will appear here as you speak, or you can type directly..."
                      className="h-48 resize-none"
                    />
                  </div>
                  
                  {/* Language Support Info */}
                  <div className="text-xs text-muted-foreground text-center">
                    <p>Supports: English, Hindi, Telugu, Urdu</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setComplaintText('');
                      resetTranscript();
                    }}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleSaveComplaint}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Complaint
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}