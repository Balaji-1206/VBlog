import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Post from '../models/Post.js'

export async function getMe(req, res){
  try{
    const user = await User.findById(req.user.id).select('_id name email createdAt')
    if(!user) return res.status(404).json({message:'User not found'})
    return res.json(user)
  }catch(err){
    return res.status(500).json({message:'Failed to fetch profile', error: err.message})
  }
}

export async function updateMe(req, res){
  try{
    const { name } = req.body
    if(!name || !name.trim()) return res.status(400).json({message:'Name is required'})
    const user = await User.findByIdAndUpdate(req.user.id, { name: name.trim() }, { new: true }).select('_id name email createdAt')
    return res.json(user)
  }catch(err){
    return res.status(500).json({message:'Update failed', error: err.message})
  }
}

export async function changePassword(req, res){
  try{
    const { currentPassword, newPassword } = req.body
    if(!currentPassword || !newPassword) return res.status(400).json({message:'Missing fields'})
    const user = await User.findById(req.user.id)
    if(!user) return res.status(404).json({message:'User not found'})
    const ok = await bcrypt.compare(currentPassword, user.passwordHash)
    if(!ok) return res.status(400).json({message:'Current password is incorrect'})
    user.passwordHash = await bcrypt.hash(newPassword, 10)
    await user.save()
    return res.json({ ok: true })
  }catch(err){
    return res.status(500).json({message:'Password change failed', error: err.message})
  }
}

export async function getMyStats(req, res){
  try{
    const author = req.user.id
    const [total, published, draft] = await Promise.all([
      Post.countDocuments({ author }),
      Post.countDocuments({ author, status:'published' }),
      Post.countDocuments({ author, status:'draft' })
    ])
    return res.json({ total, published, draft })
  }catch(err){
    return res.status(500).json({message:'Failed to fetch stats', error: err.message})
  }
}
