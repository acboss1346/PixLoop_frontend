import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Search, Users, Plus } from "lucide-react";

export const GroupsPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupLogo, setNewGroupLogo] = useState(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/communities");
      setCommunities(res.data.data);
    } catch (err) {
      console.error("Failed to fetch communities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      const formData = new FormData();
      formData.append('name', newGroupName);
      formData.append('description', newGroupDesc);
      formData.append('icon', '🌟');
      if (newGroupLogo) {
        formData.append('logo', newGroupLogo);
      }

      const res = await api.post("/communities", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setCommunities([res.data.data, ...communities]);
        setShowCreateGroup(false);
        setNewGroupName("");
        setNewGroupDesc("");
        setNewGroupLogo(null);
      }
    } catch (err) {
      console.error("Failed to create group", err);
      alert(err.response?.data?.message || "Failed to create group");
    }
  };

  const handleJoinGroup = async (communityId, e) => {
    e.preventDefault(); // prevent navigation
    try {
      const res = await api.post(`/communities/${communityId}/join`);
      if (res.data.success) {
        setCommunities(communities.map(c => 
          c.id === communityId ? { ...c, is_member: true, memberCount: parseInt(c.memberCount) + 1 } : c
        ));
      }
    } catch (err) {
      console.error("Failed to join group", err);
      alert(err.response?.data?.message || "Failed to join group");
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Communities</h1>
          <p className="text-gray-400 mt-1">Discover and join groups based on your interests.</p>
        </div>
        <button 
          onClick={() => setShowCreateGroup(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-lg shadow-purple-900/20"
        >
          <Plus size={20} />
          Create Group
        </button>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-[#333] rounded-xl leading-5 bg-[#1e1e1e] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
          placeholder="Search groups by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 h-48 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#333] rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-[#333] rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#333] rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-[#333] rounded w-full mb-2"></div>
              <div className="h-3 bg-[#333] rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : filteredCommunities.length === 0 ? (
        <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border border-[#333]">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-white mb-2">No groups found</h3>
          <p className="text-gray-400">Try adjusting your search or create a new group!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <Link 
              to={`/groups/${community.id}`} 
              key={community.id} 
              className="bg-[#1e1e1e] border border-[#333] hover:border-purple-500/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-purple-900/10 flex flex-col h-full group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#252525] flex items-center justify-center flex-shrink-0 border border-[#333]">
                    {community.logo_url ? (
                      <img src={community.logo_url} alt={community.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{community.icon}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors line-clamp-1">{community.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Users size={12} />
                      <span>{community.memberCount} members</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                {community.description || "No description provided for this group."}
              </p>
              
              <div className="mt-auto flex justify-end">
                {community.is_member ? (
                  <span className="text-xs font-medium bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full">
                    Joined
                  </span>
                ) : (
                  <button 
                    onClick={(e) => handleJoinGroup(community.id, e)}
                    className="text-xs font-medium bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-1.5 rounded-full transition-colors border border-purple-600/30 hover:border-purple-600"
                  >
                    Join Group
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] border border-[#333] p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-300">Group Name</label>
                <input 
                  type="text" 
                  value={newGroupName} 
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="E.g., Photography Enthusiasts"
                  className="w-full p-3 rounded-xl border border-[#333] bg-[#000] text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-300">Description</label>
                <textarea 
                  value={newGroupDesc} 
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="What is this group about?"
                  className="w-full p-3 rounded-xl border border-[#333] bg-[#000] text-white min-h-[100px] focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div className="mb-8">
                <label className="block mb-2 text-sm font-medium text-gray-300">Group Logo (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setNewGroupLogo(e.target.files[0])}
                  className="w-full p-2 rounded-xl border border-[#333] bg-[#000] text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all cursor-pointer"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateGroup(false)}
                  className="px-5 py-2.5 bg-transparent border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-purple-900/30"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
