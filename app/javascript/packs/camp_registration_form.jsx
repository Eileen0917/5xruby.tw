import React from 'react';
import ReactDOM from 'react-dom';
import Utils from './shared/utils';
import _ from 'lodash';

class CampRegistrationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activityCourses: {},
      selectedCourses: {},
      rules: props.rules
    }

    this.handleClickActivityCourse = this.handleClickActivityCourse.bind(this);
  }

  componentWillMount() {
    // map activityCourses
    let activityCourses = Object.assign({}, this.props.activityCourses)
    Object.keys(activityCourses).map((key, i) =>
      activityCourses[key] = {
        ...activityCourses[key],
        price: parseInt(activityCourses[key].price)
    })

    // initialize selectedCourses
    let selectedCourses = {}
    Object.keys(activityCourses).map(id =>
      selectedCourses[id] = false
    )

    this.setState({ activityCourses, selectedCourses })
  }

  getSortedActivityCoursesArray() {
    const array = Object.keys(this.state.activityCourses).map(id => this.state.activityCourses[id]);

    return array.sort(Utils.compare);
  }

  getSortedRulesArray() {
    const array = Object.keys(this.state.rules).map(id => ({
      ...this.state.rules[id],
      id: id
    }));

    return array.sort(Utils.compare);
  }

  calOriginalAmount(ids) {
    return _.reduce(this.state.activityCourses, (sum, value, key) => {
      if (_.includes(ids, key)) {
        return sum + parseInt(value.price)
      }

      return sum
    }, 0)
  }

  isMatched(ruleID) {
    const id = Object.keys(_.pickBy(this.state.selectedCourses, value => value)).sort().join("--");

    return id === ruleID
  }

  handleClickActivityCourse(id, isClicked) {
    const selectedCourses = {
      ...this.state.selectedCourses,
      [id]: isClicked
    }

    this.setState({ selectedCourses })
  }

  render() {
    const activityCoursesArray = this.getSortedActivityCoursesArray();
    const rulesArray = this.getSortedRulesArray();

    return (
      <div className="col-xs-12 col-md-8 center-block top-spacing-lg">
        <h2 className="title text-center">票卷資訊</h2>

        <hr/>

        <div className="activity-courses">
          <ol>
            {activityCoursesArray.map(item => (
              <li key={item.id}>
                <div className="col-xs-9 col-md-9">
                  {item.title}
                </div>

                <div className="col-xs-2 col-md-2">
                  {parseInt(item.price)}
                </div>

                <div className="col-xs-1 col-md-1">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      this.handleClickActivityCourse(item.id, e.target.checked)
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rule-container top-padding ">
          <div className="info text-right">根據不同選擇有不同優惠</div>

          <ul>
            {rulesArray.map(item => (
              <li
                key={item.id}
                className={this.isMatched(item.id) ? "bingo" : undefined}
              >
                <div className="col-xs-8 col-md-8">
                  {item.writing}
                </div>

                <div className="col-xs-2 col-md-2">
                  原價 {this.calOriginalAmount(item.newVals)}
                </div>

                <div className="col-xs-2 col-md-2">
                  特價 {item.price}
                </div>
              </li>
            ))}
          </ul>

          <div className="info text-right">以上優惠專案皆附有D.Git課程</div>
        </div>

        <div className="total-price">
          <h3>共計 <span className="price">0 元</span></h3>
        </div>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.querySelectorAll('.camp-registration #form')[0]

  if (node) {
    const data = Object.assign({}, node.dataset);
    Object.keys(data).map(id => data[id] = JSON.parse(data[id]));

    ReactDOM.render(<CampRegistrationForm {...data}/>, node);
  }
})
