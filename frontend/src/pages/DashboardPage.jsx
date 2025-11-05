import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import ConfirmDialog from '../components/ConfirmDialog';
import FloatingButton from '../components/FloatingButton';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
  queryKey: ['myPosts'],
  queryFn: postService.getMyPosts,
  select: (response) => {
      console.log("api response:", response);
      const data = response?.data || [];
      return Array.isArray(data) ? data : [data];
    }
});

  const createMutation = useMutation({
    mutationFn: ({ title, content }) => postService.createPost(title, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['myPosts']);
      setIsPostModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title, content }) => postService.updatePost(id, title, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['myPosts']);
      setIsPostModalOpen(false);
      setSelectedPost(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => postService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['myPosts']);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6">
          {filteredPosts?.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {filteredPosts?.length === 0 && (
            <p className="text-center text-gray-500">No posts found.</p>
          )}
        </div>
      )}

      <FloatingButton onClick={() => setIsPostModalOpen(true)} />

      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => {
          setIsPostModalOpen(false);
          setSelectedPost(null);
        }}
        onSubmit={(data) => {
          if (selectedPost) {
            updateMutation.mutate({ id: selectedPost.id, ...data });
          } else {
            createMutation.mutate(data);
          }
        }}
        post={selectedPost}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={() => deleteMutation.mutate(postToDelete)}
        isLoading={deleteMutation.isLoading}
      />
    </div>
  );
};

export default DashboardPage;