'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { assessmentsService } from '@/services/assessments';
import {
  Box, Typography, Button, Card, CardContent, Stack, TextField,
  IconButton, Grid, Alert, CircularProgress, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface QuestionForm {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  points: number;
}

const emptyQuestion: QuestionForm = {
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A',
  points: 1,
};

export default function HrAssessmentsPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobId, setJobId] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [questions, setQuestions] = useState<QuestionForm[]>([{ ...emptyQuestion }]);
  const [success, setSuccess] = useState('');

  const createMutation = useMutation({
    mutationFn: assessmentsService.createAssessment,
    onSuccess: (data) => {
      setSuccess(`Assessment "${data.title}" created successfully!`);
      setTitle('');
      setDescription('');
      setJobId('');
      setTimeLimitMinutes(30);
      setQuestions([{ ...emptyQuestion }]);
    },
  });

  const addQuestion = () => setQuestions((prev) => [...prev, { ...emptyQuestion }]);
  const removeQuestion = (i: number) => setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, field: keyof QuestionForm, value: string | number) =>
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, [field]: value } : q)));

  const handleSubmit = () => {
    createMutation.mutate({
      title,
      description,
      timeLimitMinutes,
      isRandomized: true,
      jobId,
      questions: questions.map((q) => ({
        id: '',
        text: q.text,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        points: q.points,
        correctAnswer: q.correctAnswer.charAt(0),
      })),
    });
  };

  return (
    <Box>
      <Typography variant="h5" mb={3}>Create Assessment</Typography>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>
      )}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>Assessment Details</Typography>
          <Stack spacing={2}>
            <TextField
              label="Assessment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Job ID"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  fullWidth
                  required
                  helperText="Enter the Job ID to link this assessment"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Time Limit (minutes)"
                  type="number"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Questions ({questions.length})</Typography>
        <Button startIcon={<AddIcon />} onClick={addQuestion} variant="outlined">Add Question</Button>
      </Stack>
      {questions.map((q, i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={600}>Question {i + 1}</Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => removeQuestion(i)}
                disabled={questions.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
            <Stack spacing={2}>
              <TextField
                label="Question Text"
                value={q.text}
                onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                fullWidth
                multiline
                rows={2}
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Option A"
                    value={q.optionA}
                    onChange={(e) => updateQuestion(i, 'optionA', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Option B"
                    value={q.optionB}
                    onChange={(e) => updateQuestion(i, 'optionB', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Option C"
                    value={q.optionC}
                    onChange={(e) => updateQuestion(i, 'optionC', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Option D"
                    value={q.optionD}
                    onChange={(e) => updateQuestion(i, 'optionD', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Correct Answer"
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(i, 'correctAnswer', e.target.value)}
                    fullWidth
                  >
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <MenuItem key={opt} value={opt}>Option {opt}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Points"
                    type="number"
                    value={q.points}
                    onChange={(e) => updateQuestion(i, 'points', Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      ))}
      <Box mt={2}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={
            createMutation.isPending ||
            !title ||
            !jobId ||
            questions.some((q) => !q.text)
          }
        >
          {createMutation.isPending ? <CircularProgress size={24} /> : 'Create Assessment'}
        </Button>
      </Box>
    </Box>
  );
}
