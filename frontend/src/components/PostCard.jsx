"use client"

import { memo, useEffect, useRef, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { FiMoreVertical, FiEdit2, FiTrash2, FiUser, FiChevronDown, FiChevronUp, FiClock } from "react-icons/fi"
import { getUserIdFromToken } from "../hooks/utilsAuth"

const PostCard = memo(({ post, onEdit, onDelete }) => {
  const { user } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const menuRef = useRef(null)
  const contentRef = useRef(null)

  const isAuthor = String(getUserIdFromToken(user?.token)) === String(post.author_id)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const nowIST = new Date()

    const diffMs = nowIST - date
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffSeconds < 60) return "just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  useEffect(() => {
    if (contentRef.current && !showFullContent) {
      const element = contentRef.current
      setIsTruncated(element.scrollHeight > element.clientHeight)
    }
  }, [post.content, showFullContent])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleContent = (e) => {
    e.preventDefault()
    setShowFullContent(!showFullContent)
  }

  return (
    <div className="bg-linear-to-br from-white to-slate-50 rounded-2xl shadow-md hover:shadow-2xl border border-slate-200 hover:border-slate-300 p-6 mb-5 transition-all duration-300 group overflow-hidden relative">
      <div className="absolute top-0 left-0 h-1 w-0 group-hover:w-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-500" />

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3 group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300 line-clamp-2">
            {post.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-slate-100 group-hover:bg-blue-50 px-3 py-2 rounded-full transition-colors duration-200">
              <FiUser className="h-4 w-4 text-slate-600 group-hover:text-blue-600" />
              <span className="font-semibold text-slate-700">{post.author_name}</span>
            </div>

            {post.created_at && (
              <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-700 transition-colors duration-200">
                <FiClock className="h-4 w-4" />
                <span className="text-xs">{formatDate(post.created_at)}</span>
              </div>
            )}
          </div>
        </div>

        {isAuthor && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 hover:bg-slate-200 rounded-xl transition-all duration-200 text-slate-400 hover:text-slate-700 active:scale-95 group-hover:visible"
              aria-label="Post options"
            >
              <FiMoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    onEdit(post)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                >
                  <FiEdit2 className="h-4 w-4" />
                  <span>Edit Post</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(post.id)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <FiTrash2 className="h-4 w-4" />
                  <span>Delete Post</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-5">
        <div
          ref={contentRef}
          className={`text-slate-700 leading-relaxed text-base ${!showFullContent && "line-clamp-3"} ${
            !showFullContent && "bg-linear-to-b from-slate-700 to-transparent bg-clip-text"
          }`}
        >
          {post.content}
        </div>

        

        {isTruncated && (
          <button
            onClick={toggleContent}
            className="mt-3 flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-all duration-200 hover:gap-2"
          >
            <span>{showFullContent ? "Show Less" : "Read More"}</span>
            {showFullContent ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  )
})

PostCard.displayName = "PostCard"
export default PostCard
