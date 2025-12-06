import slugify from 'slugify';
import Post from '../models/Post.js';

export async function createPost(req, res) {
  try {
    const { title, content, tags = [], status = 'draft', coverImageUrl, videoUrl } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Missing fields' });
    const slugBase = slugify(title, { lower: true, strict: true });
    let slug = slugBase;
    let i = 1;
    while (await Post.findOne({ slug })) {
      slug = `${slugBase}-${i++}`;
    }
    const excerpt = content.length > 160 ? content.slice(0, 157) + '...' : content;
    const post = await Post.create({ title, slug, content, excerpt, tags, status, coverImageUrl, videoUrl, author: req.user.id });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: 'Create failed', error: err.message });
  }
}

export async function getPublishedPosts(req, res) {
  try {
    const { page = 1, limit = 10, tag, q } = req.query;
    const filter = { status: 'published' };
    if (tag) filter.tags = tag;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } }
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('author', 'name'),
      Post.countDocuments(filter)
    ]);
    return res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    return res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
}

export async function getSinglePost(req, res) {
  try {
    const { slug } = req.params;
    let post = await Post.findOne({ slug, status: 'published' }).populate('author', 'name');
    if (post) return res.json(post);

    post = await Post.findOne({ slug }).populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (post.status === 'draft') {
      if (req.user && String(post.author._id || post.author) === req.user.id) {
        return res.json(post);
      }
      return res.status(404).json({ message: 'Not found' });
    }
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
}

export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (String(post.author) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const { title, content, tags, status, coverImageUrl, videoUrl } = req.body;
    if (title) post.title = title;
    if (content) {
      post.content = content;
      post.excerpt = content.length > 160 ? content.slice(0, 157) + '...' : content;
    }
    if (tags) post.tags = tags;
    if (status) post.status = status;
    if (coverImageUrl) post.coverImageUrl = coverImageUrl;
    if (videoUrl) post.videoUrl = videoUrl;
    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: 'Update failed', error: err.message });
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (String(post.author) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await post.deleteOne();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: 'Delete failed', error: err.message });
  }
}

export async function getMyPosts(req, res) {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ updatedAt: -1 });
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
}
