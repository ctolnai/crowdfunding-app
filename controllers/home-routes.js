const router = require('express').Router();
const { User, Project } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const projectData = await Project.findAll({
      include: [
        {
          model: Project,
          attributes: ['name', 'description'],
        },
      ],
    });

    const projects = projectData.map((project) =>
      project.get({ plain: true })
    );

    res.render('homepage', {
      projects,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one gallery
// Use the custom middleware before allowing the user to access the gallery
router.get('/project/:id', withAuth, async (req, res) => {
  try {
    const dbCrowdFundData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          attributes: [
            'id',
            'name',
            'date_created',
            'needed_funding',
            'user_id',
            'description',
          ],
        },
      ],
    });

    const project = dbCrowdFundData.get({ plain: true });
    res.render('project', { project, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one painting
// Use the custom middleware before allowing the user to access the painting
router.get('/painting/:id', withAuth, async (req, res) => {
  try {
    const dbPaintingData = await Painting.findByPk(req.params.id);

    const painting = dbPaintingData.get({ plain: true });

    res.render('painting', { painting, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
