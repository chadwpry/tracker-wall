// Generated by CoffeeScript 1.6.3
(function() {
  var Iteration, IterationsCollection, KanbanView, Project, ProjectsCollection, ProjectsView, Story, StoryView, StoryWall, TokenView, TrackerApplication, _ref, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Project = (function(_super) {
    __extends(Project, _super);

    function Project() {
      _ref = Project.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Project.prototype.urlRoot = "https://www.pivotaltracker.com/services/v5/projects";

    Project.prototype.initialize = function(options) {
      this.constructor.__super__.initialize.apply(this, [options]);
      return this.iterationsCollection = new IterationsCollection(this);
    };

    Project.prototype.fetchIterations = function(options) {
      return this.iterationsCollection.fetch({
        data: {
          token: TrackerApplication.token(),
          scope: options['scope']
        }
      });
    };

    return Project;

  })(Backbone.Model);

  ProjectsCollection = (function(_super) {
    __extends(ProjectsCollection, _super);

    function ProjectsCollection() {
      _ref1 = ProjectsCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ProjectsCollection.prototype.model = Project;

    ProjectsCollection.prototype.url = "https://www.pivotaltracker.com/services/v5/projects";

    return ProjectsCollection;

  })(Backbone.Collection);

  Iteration = (function(_super) {
    __extends(Iteration, _super);

    function Iteration() {
      _ref2 = Iteration.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Iteration.prototype.availableStories = function() {
      return _.map(get('stories'), function(story) {
        return new Story(story.toJSON());
      });
    };

    return Iteration;

  })(Backbone.Model);

  IterationsCollection = (function(_super) {
    __extends(IterationsCollection, _super);

    function IterationsCollection() {
      _ref3 = IterationsCollection.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    IterationsCollection.prototype.model = Iteration;

    IterationsCollection.prototype.url = "https://www.pivotaltracker.com/services/v5/projects/:project_id/iterations";

    IterationsCollection.prototype.initialize = function(project) {
      this.project = project;
      return this.url = this.url.replace(":project_id", project.get('id'));
    };

    return IterationsCollection;

  })(Backbone.Collection);

  Story = (function(_super) {
    var ACCEPTED, BLOCKED, BUG, CHORE, DELIVERED, FEATURE, FINISHED, ONCALL, REJECTED, RELEASE, STARTED, UNSTARTED;

    __extends(Story, _super);

    function Story() {
      _ref4 = Story.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    BUG = "bug";

    CHORE = "chore";

    FEATURE = "feature";

    RELEASE = "release";

    UNSTARTED = "unstarted";

    STARTED = "started";

    FINISHED = "finished";

    DELIVERED = "delivered";

    REJECTED = "rejected";

    ACCEPTED = "accepted";

    BLOCKED = "blocked";

    ONCALL = "old-on-call";

    Story.prototype.url = "https://www.pivotaltracker.com/services/v5/projects/:project_id/stories";

    Story.prototype.initialize = function(json) {
      return this.url = "" + (this.url.replace(":project_id", json.project_id)) + "/" + json.id;
    };

    Story.prototype.feature = function() {
      return this.get('story_type') === FEATURE;
    };

    Story.prototype.mark = function() {
      if (this.feature != null) {
        return this.get('estimate');
      } else {
        return this.get('story_type').charAt(0).toUpperCase();
      }
    };

    Story.prototype.onCall = function() {
      var label, labels, _i, _len, _ref5;
      _ref5 = this.get('labels');
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        label = _ref5[_i];
        if (label.name === ONCALL) {
          labels = label;
        }
      }
      return !!labels;
    };

    Story.prototype.status = function() {
      var state;
      state = this.get('current_state');
      if (state === UNSTARTED) {
        return 'available';
      } else if (state === STARTED || state === FINISHED || state === REJECTED) {
        return 'development';
      } else if (state === DELIVERED) {
        return 'test';
      } else if (state === ACCEPTED) {
        return 'complete';
      }
    };

    Story.prototype.type = function() {
      if (this.onCall()) {
        return 'on-call';
      } else {
        return this.get('story_type');
      }
    };

    return Story;

  })(Backbone.Model);

  ProjectsView = (function(_super) {
    __extends(ProjectsView, _super);

    function ProjectsView() {
      _ref5 = ProjectsView.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    ProjectsView.prototype.el = '#projects';

    ProjectsView.prototype.tagName = 'ul';

    ProjectsView.prototype.initialize = function() {
      var _this = this;
      this.projectsCollection = new ProjectsCollection;
      return this.projectsCollection.on("add", function(model) {
        return _this.addProject(model);
      });
    };

    ProjectsView.prototype.addProject = function(model) {
      var project,
        _this = this;
      project = $("<li><a data-cid='" + model.cid + "' data-id='" + (model.get('id')) + "' href='#'>" + (model.get('name')) + "</a></li>");
      project.find('a').click(function() {
        return _this.trigger('project-selected', model);
      });
      return this.$el.append(project);
    };

    ProjectsView.prototype.render = function() {
      this.projectsCollection.fetch({
        data: {
          token: TrackerApplication.token()
        }
      });
      this.$el.show();
      return this;
    };

    return ProjectsView;

  })(Backbone.View);

  TokenView = (function(_super) {
    __extends(TokenView, _super);

    function TokenView() {
      this.submitApiToken = __bind(this.submitApiToken, this);
      _ref6 = TokenView.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    TokenView.prototype.el = '#token';

    TokenView.prototype.tagName = 'form';

    TokenView.prototype.initialize = function() {
      this.$el.find('#token-submit').click(this.submitApiToken);
      return this;
    };

    TokenView.prototype.render = function() {
      this.$el.show();
      return this;
    };

    TokenView.prototype.submitApiToken = function(element) {
      document.cookie = "pivotal-api-token=" + (this.$el.find('input.api-token').val());
      this.trigger('token-stored');
      return this.$el.hide();
    };

    return TokenView;

  })(Backbone.View);

  StoryWall = (function(_super) {
    __extends(StoryWall, _super);

    function StoryWall() {
      _ref7 = StoryWall.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    StoryWall.prototype.tagName = 'div';

    StoryWall.prototype.className = 'stickies';

    return StoryWall;

  })(Backbone.View);

  StoryView = (function(_super) {
    __extends(StoryView, _super);

    function StoryView() {
      _ref8 = StoryView.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    StoryView.prototype.tagName = 'div';

    StoryView.prototype.className = 'story';

    StoryView.prototype.initialize = function(story) {
      return this.story = story;
    };

    StoryView.prototype.render = function() {
      var template;
      template = _.template("<h5 class='complexity <%= story_type %>'><%= mark %></h5><p class='description'><%= name %></p><p class='user legend'></p><p class='user'>" + "</p>");
      this.$el.addClass(this.story.current_state);
      this.$el.addClass(this.story.type());
      this.$el.attr('cid', this.story.cid);
      this.$el.html(template({
        id: "@story-" + (this.story.get('id')),
        cid: this.story.cid,
        current_state: this.story.get('current_state'),
        name: this.story.get('name'),
        mark: this.story.mark(),
        story_type: this.story.get('@story_type'),
        type: this.story.type()
      }));
      return this;
    };

    return StoryView;

  })(Backbone.View);

  KanbanView = (function(_super) {
    var COLUMNS,
      _this = this;

    __extends(KanbanView, _super);

    function KanbanView() {
      this.renderTotals = __bind(this.renderTotals, this);
      this.addIterationToWall = __bind(this.addIterationToWall, this);
      _ref9 = KanbanView.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    COLUMNS = {
      available: {
        title: 'Available',
        action: function(event, ui) {
          return console.log(ui.draggable);
        }
      },
      development: {
        title: 'Development',
        action: function(event, ui) {
          return console.log(event.target);
        }
      },
      test: {
        title: 'Title',
        action: function(event, ui) {
          return console.log(event.target);
        }
      },
      complete: {
        title: 'Complete',
        action: function(event, ui) {
          return console.log(event.target);
        }
      }
    };

    KanbanView.prototype.el = '#stories';

    KanbanView.prototype.tagName = 'section';

    KanbanView.prototype.initialize = function(project) {
      this.project = project;
      return this.totals = {
        available: 0,
        development: 0,
        test: 0,
        complete: 0
      };
    };

    KanbanView.prototype.addStory = function(story) {
      var storyView;
      if (typeof story.feature === "function" ? story.feature() : void 0) {
        this.totals[story.status()] += +story.get('estimate');
      }
      if (this.$el.find("#story-" + (story.get('id'))).length === 0) {
        storyView = new StoryView(story);
        storyView.render();
        $(storyView.el).draggable({
          revert: "invalid"
        });
        return this.$el.find("." + (story.status()) + " .stickies").append(storyView.el);
      }
    };

    KanbanView.prototype.handleDroppedStory = function(event, ui) {
      return console.log(event);
    };

    KanbanView.prototype.addIterationToWall = function(iteration) {
      var _this = this;
      _.each(iteration.get('stories'), function(json) {
        return _this.addStory(new Story(json));
      });
      return this.renderTotals();
    };

    KanbanView.prototype.render = function() {
      var _this = this;
      this.renderBase().renderHeaders().renderStoryArea();
      this.project.iterationsCollection.on("add", this.addIterationToWall);
      this.project.fetchIterations({
        scope: 'current_backlog'
      });
      _.each(COLUMNS, function(column, key) {
        return _this.$el.find("." + key + ".wall").droppable({
          accept: ".chore, .feature, .bug",
          drop: function(event, ui) {
            return column.action(event, ui);
          }
        });
      });
      return this;
    };

    KanbanView.prototype.renderBase = function() {
      var template;
      template = _.template("<table id='project-" + (this.project.get('id')) + "' class='kanban'><thead></thead><tbody></tbody></table>");
      this.$el.html(template());
      return this;
    };

    KanbanView.prototype.renderHeaders = function() {
      var template;
      template = _.template("<tr>" + (_.map(COLUMNS, function(column, key) {
        return "<td class='" + key + " label'>" + column.title + "</td>";
      })) + "</tr>");
      this.$el.find('table tbody').append(template());
      return this;
    };

    KanbanView.prototype.renderStoryArea = function() {
      var template;
      template = _.template("<tr>" + (_.map(COLUMNS, function(column, key) {
        return "<td class='" + key + " wall'><div class='stickies'></div></td>";
      })) + "</tr>");
      this.$el.find('table tbody').append(template());
      return this;
    };

    KanbanView.prototype.renderTotals = function() {
      var _this = this;
      _.each(COLUMNS, function(column, key) {
        return _this.$el.find(".label." + key).text("" + column.title + " (" + _this.totals[key] + ")");
      });
      return this;
    };

    return KanbanView;

  }).call(this, Backbone.View);

  TrackerApplication = (function(_super) {
    __extends(TrackerApplication, _super);

    function TrackerApplication() {
      _ref10 = TrackerApplication.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    TrackerApplication.prototype.el = 'body';

    TrackerApplication.prototype.tagName = 'body';

    TrackerApplication.prototype.initialize = function() {
      var _this = this;
      this.tokenView = new TokenView;
      this.tokenView.on('token-stored', function() {
        return _this.render();
      });
      this.projectsView = new ProjectsView;
      return this.projectsView.on('project-selected', function(project) {
        _this.updateSelectedProject(project);
        return _this.constructor.setCookie('tracker-project-id', project.get('id'));
      });
    };

    TrackerApplication.prototype.render = function() {
      var project,
        _this = this;
      if (TrackerApplication.token()) {
        this.projectsView.render();
        if (TrackerApplication.projectId()) {
          project = new Project({
            id: TrackerApplication.projectId()
          });
          project.on('change', function(model) {
            return _this.updateSelectedProject(model);
          });
          return project.fetch({
            data: {
              token: TrackerApplication.token()
            }
          });
        }
      } else {
        return this.tokenView.render();
      }
    };

    TrackerApplication.prototype.updateSelectedProject = function(project) {
      if (this.$el.find("#project-" + (project.get('id'))).length === 0) {
        this.$el.find('header h1').text(project.get('name'));
        return this.$el.append(new KanbanView(project).render().el);
      }
    };

    TrackerApplication.getCookie = function(value) {
      var cookie;
      cookie = _.find(document.cookie.split(';'), function(cookieString) {
        return _.find(cookieString.trim().split('='), function(key, index, cookie) {
          if (key === value) {
            return true;
          }
        });
      });
      if (cookie) {
        return _.last(cookie.split('='));
      }
    };

    TrackerApplication.setCookie = function(name, value) {
      return document.cookie = "" + name + "=" + value;
    };

    TrackerApplication.projectId = function() {
      return this.getCookie('tracker-project-id');
    };

    TrackerApplication.token = function() {
      return TrackerApplication.getCookie('pivotal-api-token');
    };

    return TrackerApplication;

  }).call(this, Backbone.View);

  Backbone.ajax = function() {
    var args;
    args = Array.prototype.slice.call(arguments, 0);
    if (args.length > 0) {
      args[0].beforeSend = function(request) {
        return request.setRequestHeader("X-TrackerToken", TrackerApplication.token());
      };
    }
    return Backbone.$.ajax.apply(Backbone.$, args);
  };

  new TrackerApplication().render();

}).call(this);
