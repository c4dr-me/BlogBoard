import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import PostModal from '../components/PostModal';
import ConfirmDialog from '../components/ConfirmDialog';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading, } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getAllPosts,
    select: (response) => {
      const data = response?.data || [];
      return Array.isArray(data) ? data : [data];
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title, content }) => postService.updatePost(id, title, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setIsPostModalOpen(false);
      setSelectedPost(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => postService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setIsConfirmDialogOpen(false);
      setPostToDelete(null);
    }
  });

  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const handleDelete = (postId) => {
    setPostToDelete(postId);
    setIsConfirmDialogOpen(true);
  };

  const filteredPosts = posts?.filter(post => 
    post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-500">No posts found.</p>
          )}
        </div>
      )}

      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => {
          setIsPostModalOpen(false);
          setSelectedPost(null);
        }}
        onSubmit={(data) => {
          if (selectedPost) {
            updateMutation.mutate({ id: selectedPost.id, ...data });
          }
        }}
        post={selectedPost}
        isLoading={updateMutation.isLoading}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={() => deleteMutation.mutate(postToDelete)}
        isLoading={deleteMutation.isLoading}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="danger"
      />
    </div>
  );
};

export default HomePage;