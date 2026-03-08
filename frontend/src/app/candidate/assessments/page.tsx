'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { assessmentsService } from '@/services/assessments';
import {
  Box, Typography, Card, CardContent, Stack, Button, TextField, Radio,
  RadioGroup, FormControlLabel, FormControl, FormLabel, LinearProgress,
  Alert, CircularProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import WarningIcon from '@mui/icons-material/Warning';
import { Assessment, AssessmentResult } from '@/types';

const FOCUS_LOSS_WARNING_THRESHOLD = 1;

export default function CandidateAssessmentsPage() {
  const [assessmentId, setAssessmentId] = useState('');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [focusLostCount, setFocusLostCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const submitMutation = useMutation({
    mutationFn: ({
      answers: ans,
      timeTaken,
      focusLost,
    }: {
      answers: { questionId: string; answer: string }[];
      timeTaken: number;
      focusLost: number;
    }) => assessmentsService.submitResult(assessment!.id, ans, timeTaken, focusLost),
    onSuccess: (data) => {
      setResult(data);
      setStarted(false);
      if (timerRef.current) clearInterval(timerRef.current);
    },
  });

  const handleSubmit = useCallback(() => {
    if (!assessment || !startTime) return;
    const timeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const answerList = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
    submitMutation.mutate({ answers: answerList, timeTaken, focusLost: focusLostCount });
  }, [assessment, startTime, answers, focusLostCount, submitMutation]);

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, handleSubmit, timeLeft]);

  useEffect(() => {
    if (!started) return;
    const handleBlur = () => {
      setFocusLostCount((prev) => {
        const next = prev + 1;
        if (next > FOCUS_LOSS_WARNING_THRESHOLD) setWarningOpen(true);
        return next;
      });
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [started]);

  const loadAssessment = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await assessmentsService.getAssessment(assessmentId);
      setAssessment(data);
    } catch {
      setError('Assessment not found. Please check the ID.');
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = () => {
    setStarted(true);
    setStartTime(new Date());
    setTimeLeft(assessment!.timeLimitMinutes * 60);
    setFocusLostCount(0);
    setAnswers({});
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (result) {
    return (
      <Box maxWidth={600} mx="auto">
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" mb={2}>Assessment Complete!</Typography>
            <Typography
              variant="h2"
              fontWeight={700}
              color={result.percentage >= 70 ? 'success.main' : 'warning.main'}
            >
              {result.percentage}%
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3}>
              {result.score} / {result.maxScore} points
            </Typography>
            <Stack spacing={1} mb={3}>
              <Typography variant="body2">
                Time taken: {Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s
              </Typography>
              {result.completedWithCheatingFlag && (
                <Alert severity="warning">
                  Assessment flagged: {result.focusLostCount} focus losses detected
                </Alert>
              )}
            </Stack>
            <Button
              variant="contained"
              onClick={() => { setResult(null); setAssessment(null); setAssessmentId(''); }}
            >
              Take Another Assessment
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (started && assessment) {
    const progress = (Object.keys(answers).length / assessment.questions.length) * 100;
    return (
      <Box maxWidth={800} mx="auto">
        <Dialog open={warningOpen} onClose={() => setWarningOpen(false)}>
          <DialogTitle sx={{ color: 'warning.main' }}>⚠️ Focus Warning</DialogTitle>
          <DialogContent>
            <Typography>
              You have switched tabs or windows {focusLostCount} time(s).
              Multiple violations will flag your assessment.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWarningOpen(false)} variant="contained">Continue Assessment</Button>
          </DialogActions>
        </Dialog>
        <Card sx={{ mb: 2, position: 'sticky', top: 80, zIndex: 10 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{assessment.title}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                {focusLostCount > 0 && (
                  <Chip
                    icon={<WarningIcon />}
                    label={`${focusLostCount} warnings`}
                    color="warning"
                    size="small"
                  />
                )}
                <Chip
                  icon={<TimerIcon />}
                  label={formatTime(timeLeft)}
                  color={timeLeft < 300 ? 'error' : 'primary'}
                />
                <Typography variant="body2">
                  {Object.keys(answers).length}/{assessment.questions.length} answered
                </Typography>
              </Stack>
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
          </CardContent>
        </Card>
        {assessment.questions.map((q, i) => (
          <Card key={q.id} sx={{ mb: 2 }}>
            <CardContent>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                  {i + 1}. {q.text}{' '}
                  <Chip label={`${q.points} pt${q.points > 1 ? 's' : ''}`} size="small" sx={{ ml: 1 }} />
                </FormLabel>
                <RadioGroup
                  value={answers[q.id] ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                >
                  {[
                    { key: 'A', text: q.optionA },
                    { key: 'B', text: q.optionB },
                    { key: 'C', text: q.optionC },
                    { key: 'D', text: q.optionD },
                  ].map((opt) => (
                    <FormControlLabel
                      key={opt.key}
                      value={opt.key}
                      control={<Radio />}
                      label={`${opt.key}. ${opt.text}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        ))}
        <Box mt={2} mb={4}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? <CircularProgress size={24} /> : 'Submit Assessment'}
          </Button>
        </Box>
      </Box>
    );
  }

  if (assessment) {
    return (
      <Box maxWidth={600} mx="auto">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" mb={1}>{assessment.title}</Typography>
            {assessment.description && (
              <Typography color="text.secondary" mb={2}>{assessment.description}</Typography>
            )}
            <Stack spacing={1} mb={3}>
              <Typography><strong>Time Limit:</strong> {assessment.timeLimitMinutes} minutes</Typography>
              <Typography><strong>Questions:</strong> {assessment.questionCount}</Typography>
              <Typography><strong>Randomized:</strong> {assessment.isRandomized ? 'Yes' : 'No'}</Typography>
            </Stack>
            <Alert severity="info" sx={{ mb: 3 }}>
              Anti-cheating measures are active. Switching tabs or windows will be tracked and may
              flag your assessment.
            </Alert>
            <Button variant="contained" size="large" fullWidth onClick={startAssessment}>
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h5" mb={3}>Take an Assessment</Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary" mb={3}>
            Enter the Assessment ID provided by your HR team to start your assessment.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2}>
            <TextField
              label="Assessment ID"
              value={assessmentId}
              onChange={(e) => setAssessmentId(e.target.value)}
              fullWidth
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            />
            <Button
              variant="contained"
              onClick={loadAssessment}
              disabled={!assessmentId || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Load Assessment'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
