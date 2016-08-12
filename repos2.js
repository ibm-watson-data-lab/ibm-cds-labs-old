class LanguageList extends React.Component {
    componentWillMount() {
        var languages = [];
        this.props.data.forEach(function(repo) {
        var langs = repo.languages;
        langs.forEach(function(lang) {
            if ( languages.indexOf(lang) < 0 ) languages.push(lang);
        }, this);
        }, this);
        this.state = languages;
    }

  render() {

    var languageels = this.state.map(function(langstr, idx) {
      var langid = 'lang-' + langstr;
      return (
            <label className="langlabel"><input type="checkbox" id={langid}></input>{langstr}</label>
      )
    });

    return (
      <div>
        <span>Languages: </span>{languageels}
      </div>
    );
  }
};

var TechnologyList = React.createClass({
  render: function() {
    var technologies = [];
    this.props.data.forEach(function(repo) {
      var techs = repo.technologies;
      techs.forEach(function(tech) {
        if ( technologies.indexOf(tech) < 0 ) technologies.push(tech);
      }, this);
    }, this);

    var technologyels = technologies.map(function(techstr, idx) {
      var techid = 'tech-' + techstr;
      return (
            <label className="techlabel"><input type="checkbox" id={techid}></input>{techstr}</label>
      )
    });

    return (
      <div>
        <span>Technologies: </span>{technologyels}
      </div>
    );
  }
});

var TechnologyFacet = React.createClass({
  render: function() {
    return (
      <div className="label facet-technology">{this.props.data}</div>
    );
  }
});

var Repo = React.createClass({
  render: function() {
    var technologies = this.props.data.technologies.map(function(tech) {
      return (
        <TechnologyFacet data={tech} key={tech}></TechnologyFacet>
      );
    });

    var languages = this.props.data.languages.map(function(lang) {
      return (
        <div className="label facet-language" key={lang}>{lang}</div>
      );
    });

    return (
      <div className="repo col-md-4">
        <div className="reponame">
          <h2 className="reponamerow">{this.props.data.name}</h2>
        </div>
        <div className="repodetails">
          <div className="row repodetailsheaders">
            <div className="author col-md-4">by:</div>
            <div className="updated col-md-4">updated:</div>
            <div className="gh-stuff col-md-4">GitHub:</div>
          </div>
          <div className="row repodetailsnumbers">
            <div className="author col-md-4">{this.props.data.author || 'unknown'}</div>
            <div className="updated col-md-4">{this.props.data.updated_at.substr(0,10)}</div>
            <div className="gh-stuff col-md-4"> </div>
          </div>

          <div className="row">
            <div className="description col-md-8">
              <p className="descriptiontext">{this.props.data.description || 'unknown'}</p>
              <div className="descriptioncontrols"><a className="btn btn-success" href={this.props.data.url} role="button">Details</a></div>
            </div>
            <div className="facets col-md-4">
              <p>tech</p>
              <div className="facet">{technologies}</div>
              <p>languages</p>
              <div className="facet">{languages}</div>
              <p>level</p>
              <div className="facet">
                <div className="label facet-level">{this.props.level || 'unspecified'}</div>
              </div>
            </div>
          </div>

        </div>        
      </div>
    );
  }
});

var RepoList = React.createClass({
  render: function() {
    var repoNodes = this.props.data.map(function(repo) {
      return (
        <Repo data={repo} key={repo._id}></Repo>
      );
    });
    return (
      <div className="repoList">
        {repoNodes}
      </div>
    );
  }
});

var Repos = React.createClass({
  getInitialState: function() {
    return {data:[]};
  },

  componentDidMount: function() {
    $.getJSON(this.props.source, function(data) {
      console.log("got JSON reponse");
    })
    .done(function(data) {
      var repos = [];
      var numrepos = data.rows.length;
      for (var index = 0; index < numrepos; index++) {
        var row = data.rows[index]
        repos.push(row.doc);
      }
      this.setState({data:repos});
    }.bind(this));


    // this.serverRequest = $.get(this.props.source, function (result) {
    //   var repos = [];
    //   var numrepos = result.rows.length;
    //   for (var index = 0; index < numrepos; index++) {
    //     var row = result.rows[index]
    //     repos.push(row.doc);
    //   }
    //   this.setState(repos);
    // }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return (
      <div className="repos">
        <TechnologyList data={this.state.data} />
        <LanguageList data={this.state.data} />
        <RepoList data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(
  // <Repos source="https://d14f43e9-5102-45bc-b394-c92520c2c0bd-bluemix.cloudant.com/devcenter/_design/github/_view/github?reduce=false&include_docs=true" />,
  <Repos source="/ibm-cds-labs.github.io/github.json" />, 
  document.getElementById('react-repos')
);