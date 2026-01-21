// ========================================
// EPS 737 - Psychological Assessment Module
// Dashboard Integration for Course Panel
// ========================================

const EPS737 = {
  dataPath: 'data/courses/eps737.json',
  data: null,

  // Initialize the module
  async init() {
    await this.loadData();
    this.render();
  },

  // Fetch JSON data
  async loadData() {
    try {
      const response = await fetch(this.dataPath);
      if (!response.ok) {
        console.warn('EPS 737: Could not load course data');
        return;
      }
      this.data = await response.json();
    } catch (error) {
      console.warn('EPS 737: Data fetch error', error.message);
    }
  },

  // Render all dynamic content
  render() {
    if (!this.data) return;
    
    this.updateCurrentWeek();
    this.updateSemesterProgress();
    this.updateAssignments();
    this.updateProjectNotes();
  },

  // Highlight current week in schedule table
  updateCurrentWeek() {
    const currentWeek = this.data.currentWeek;
    if (!currentWeek) return;

    document.querySelectorAll('.schedule-table tr[data-week]').forEach(row => {
      row.classList.remove('current-week');
      if (parseInt(row.dataset.week) === currentWeek) {
        row.classList.add('current-week');
      }
    });
  },

  // Update semester progress bar and label
  updateSemesterProgress() {
    const currentWeek = this.data.currentWeek;
    const totalWeeks = this.data.semesterWeeks || 16;
    
    const progressLabel = document.querySelector('[data-progress="week"]');
    const progressBar = document.querySelector('[data-progress="bar"]');
    
    if (progressLabel) {
      progressLabel.textContent = `Week ${currentWeek} of ${totalWeeks}`;
    }
    
    if (progressBar) {
      const percentage = (currentWeek / totalWeeks) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  },

  // Update all assignment status bars
  updateAssignments() {
    const assignments = this.data.assignments;
    if (!assignments) return;

    Object.entries(assignments).forEach(([key, assignment]) => {
      const card = document.querySelector(`[data-assignment="${key}"]`);
      if (!card) return;

      const fill = card.querySelector('.status-bar-fill');
      const label = card.querySelector('.status-label');

      if (!fill || !label) return;

      // Set progress width
      fill.style.width = `${assignment.progress}%`;

      // Update status classes and label
      fill.classList.remove('in-progress', 'complete', 'due-soon', 'overdue');
      
      if (assignment.status === 'complete') {
        fill.classList.add('complete');
        label.textContent = 'Complete ✓';
      } else if (assignment.status === 'overdue') {
        fill.classList.add('overdue');
        label.textContent = 'Overdue';
      } else if (assignment.status === 'due_soon') {
        fill.classList.add('due-soon');
        label.textContent = assignment.progress > 0 ? `${assignment.progress}% - Due Soon` : 'Due Soon';
      } else if (assignment.progress > 0) {
        fill.classList.add('in-progress');
        label.textContent = `${assignment.progress}%`;
      } else {
        label.textContent = 'Not Started';
      }

      // Check if assignment is due soon (within 7 days)
      if (assignment.status !== 'complete' && assignment.dueDate) {
        const dueDate = new Date(assignment.dueDate);
        const today = new Date();
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue < 0) {
          fill.classList.add('overdue');
          if (assignment.progress < 100) {
            label.textContent = 'Overdue';
          }
        } else if (daysUntilDue <= 7 && assignment.progress < 100) {
          fill.classList.add('due-soon');
          label.textContent = assignment.progress > 0 
            ? `${assignment.progress}% - ${daysUntilDue}d left` 
            : `${daysUntilDue}d left`;
        }
      }
    });
  },

  // Update project notes in sidebar
  updateProjectNotes() {
    const project = this.data.project;
    if (!project) return;

    const elements = {
      partner: document.querySelector('[data-project="partner"] .note-content'),
      partnerCharacter: document.querySelector('[data-project="partner-character"] .note-content'),
      yourCharacter: document.querySelector('[data-project="your-character"] .note-content'),
      todo: document.querySelector('[data-project="todo"] .note-content')
    };

    if (elements.partner && project.partner) {
      elements.partner.textContent = project.partner;
    }

    if (elements.partnerCharacter && project.partnerCharacter) {
      elements.partnerCharacter.textContent = project.partnerCharacter;
    }

    if (elements.yourCharacter && project.yourCharacter) {
      elements.yourCharacter.textContent = project.yourCharacter;
    }

    if (elements.todo && project.todos && project.todos.length > 0) {
      // Display first todo, or join multiple
      elements.todo.textContent = project.todos.join('; ');
    }
  },

  // Calculate overall course progress
  getOverallProgress() {
    if (!this.data || !this.data.assignments) return 0;
    
    const assignments = Object.values(this.data.assignments);
    const totalPoints = assignments.reduce((sum, a) => sum + a.points, 0);
    const earnedPoints = assignments.reduce((sum, a) => {
      if (a.status === 'complete') return sum + a.points;
      return sum + (a.points * a.progress / 100);
    }, 0);
    
    return Math.round((earnedPoints / totalPoints) * 100);
  },

  // Get upcoming assignments (next 14 days)
  getUpcomingAssignments() {
    if (!this.data || !this.data.assignments) return [];
    
    const today = new Date();
    const twoWeeksOut = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    return Object.entries(this.data.assignments)
      .filter(([key, a]) => {
        if (a.status === 'complete') return false;
        const dueDate = new Date(a.dueDate);
        return dueDate >= today && dueDate <= twoWeeksOut;
      })
      .map(([key, a]) => ({
        key,
        name: a.name,
        dueDate: a.dueDate,
        points: a.points,
        progress: a.progress
      }))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
};

// ========================================
// Dashboard Integration
// ========================================

// For lazy-loaded panel: Initialize when panel becomes visible
function initEPS737Panel() {
  // Check if we're on the EPS 737 panel
  const panel = document.querySelector('[data-course="eps737"]') || 
                document.querySelector('.eps737-panel') ||
                document.body;
  
  if (panel) {
    EPS737.init();
  }
}

// MutationObserver for lazy-loaded panels (matches dashboard architecture)
const eps737Observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Check if EPS 737 panel content was added
        if (node.querySelector && (
            node.querySelector('[data-assignment]') ||
            node.classList?.contains('eps737-panel')
        )) {
          EPS737.init();
        }
      }
    });
  });
});

// Start observing for panel loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    eps737Observer.observe(document.body, { childList: true, subtree: true });
    initEPS737Panel();
  });
} else {
  eps737Observer.observe(document.body, { childList: true, subtree: true });
  initEPS737Panel();
}

// Export for ES modules
export { EPS737, initEPS737Panel };
