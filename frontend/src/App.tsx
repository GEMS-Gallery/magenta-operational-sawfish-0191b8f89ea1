import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjUzODUyMDd8&ixlib=rb-4.0.3)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8),
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: { title: string; body: string; author: string }) => {
    setLoading(true);
    try {
      await backend.createPost(data.title, data.body, data.author);
      reset();
      setShowForm(false);
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5">
          Share your thoughts on the world of cryptocurrency
        </Typography>
      </HeroSection>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '1rem' }}
      >
        {showForm ? 'Cancel' : 'Create Post'}
      </Button>

      {showForm && (
        <Card style={{ marginBottom: '1rem' }}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: 'Title is required' }}
                render={({ field, fieldState: { error } }) => (
                  <div style={{ marginBottom: '1rem' }}>
                    <Typography variant="subtitle1">Title</Typography>
                    <input {...field} style={{ width: '100%', padding: '0.5rem' }} />
                    {error && <Typography color="error">{error.message}</Typography>}
                  </div>
                )}
              />
              <Controller
                name="body"
                control={control}
                defaultValue=""
                rules={{ required: 'Body is required' }}
                render={({ field, fieldState: { error } }) => (
                  <div style={{ marginBottom: '1rem' }}>
                    <Typography variant="subtitle1">Body</Typography>
                    <textarea {...field} rows={4} style={{ width: '100%', padding: '0.5rem' }} />
                    {error && <Typography color="error">{error.message}</Typography>}
                  </div>
                )}
              />
              <Controller
                name="author"
                control={control}
                defaultValue=""
                rules={{ required: 'Author is required' }}
                render={({ field, fieldState: { error } }) => (
                  <div style={{ marginBottom: '1rem' }}>
                    <Typography variant="subtitle1">Author</Typography>
                    <input {...field} style={{ width: '100%', padding: '0.5rem' }} />
                    {error && <Typography color="error">{error.message}</Typography>}
                  </div>
                )}
              />
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        posts.map((post) => (
          <StyledCard key={Number(post.id)}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {post.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
              </Typography>
              <Typography variant="body2" component="p">
                {post.body}
              </Typography>
            </CardContent>
          </StyledCard>
        ))
      )}

      <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '2rem' }}>
        Hero image by{' '}
        <a href="https://unsplash.com/photos/a-person-drowns-underwater-rX12B5uX7QM" target="_blank" rel="noopener noreferrer">
          Unsplash
        </a>
      </Typography>
    </Container>
  );
}

export default App;
