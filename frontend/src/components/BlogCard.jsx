import { Link } from 'react-router-dom';

function BlogCard({ blog, formatDate }) {
  return (
    <div className="card group hover:translate-y-[-5px]">
      {blog.image && (
        <div className="h-40 overflow-hidden">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{blog.title}</h3>
          {blog.author && (
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-800 font-medium text-sm">
                {blog.author.name ? blog.author.name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 line-clamp-3">
            {blog.content ? blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '') : 'No content available'}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Link
            to={`/blogs/${blog._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group-hover:underline"
          >
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          {blog.createdAt && (
            <span className="text-xs text-gray-500">
              {formatDate(blog.createdAt)}
              {blog.updatedAt && blog.updatedAt !== blog.createdAt && ' (edited)'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
