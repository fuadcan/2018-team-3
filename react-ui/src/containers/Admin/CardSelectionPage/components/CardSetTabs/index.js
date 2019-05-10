import React from "react"
import { compose, withHandlers, lifecycle, withState } from "recompose"
import AdminCard from "../AdminCard";
import { constants as adminConstants } from "reducers/Admin"
import { HKButton } from "@heroku/react-hk-components"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import "./styles.css"

export default function CardSetTabs(props) {
  return (<div className="relative">
    <Tabs selectedTabClassName="tab-selected" defaultIndex={props.adminState.defaultTabIndex}>
      <TabList className="black-50 tab-list mr6 ml6 pt3">
        <Tab><span className="f2 b">Card set 1</span></Tab>
        <Tab><span className="f2 b">Card set 2</span></Tab>
        <Tab><span className="f2 b">Card set 3</span></Tab>
      </TabList>
      <TabPanel>
        <EnhancedAdminCards
          cardSet={props.adminState.cardSet.cardSet1.cards}
          cardSetName="cardSet1"
          {...props}
        />
      </TabPanel>
      <TabPanel>
        <EnhancedAdminCards
          cardSet={props.adminState.cardSet.cardSet2.cards}
          cardSetName="cardSet2"
          {...props}
        />
      </TabPanel>
      <TabPanel>
        <EnhancedAdminCards
          cardSet={props.adminState.cardSet.cardSet3.cards}
          cardSetName="cardSet3"
          {...props}
        />
      </TabPanel>
    </Tabs>
    {
      props.adminState.cardSetChosenForExperiment !== ""
      && <div className="cardsChosen f3 b">{`
        Card set 
        ${props.adminState.cardSetChosenForExperiment.charAt(props.adminState.cardSetChosenForExperiment.length - 1)}
        - Being used in Experiment
      `}</div>
    }
  </div>)
}

const AdminCards = (props) => {
  console.log("KANEN", props)
  return <div className="cardsContainer">
    <div className="actionButtons tr w-100 mr6">
      <HKButton
        disabled={!props.canSaveCards}
        onClick={props.saveAdminCards && props.chooseCardSetForExperiment}
        type="primary"
        className="saveAdminCardsBtn f3"
      >
        Save cards
        </HKButton>
    </div>
    <div className="flex flex-wrap justify-center">
      {
        props.cardSet.map((val, i) =>
          <AdminCard
            updateAdminCard={props.updateAdminCard}
            index={i} url={val.url}
            primaryValue={val.mainValue}
            secondaryValue={val.secondaryValue}
            adminCard={val.adminCard}
            key={i}
            imageUrl={val.img}
            cardSetName={props.cardSetName}
          />)
      }
    </div>
  </div>
}

const EnhancedAdminCards = compose(
  withState("canSaveCards", "setCanSaveCards", false),
  withHandlers({
    saveAdminCards: (props) => (e) => {
      e.preventDefault()
      props.adminDispatch({
        type: adminConstants.SUBMIT_ADMIN_CARDS,
      })
    },
    chooseCardSetForExperiment: (props) => (e) => {
      props.adminDispatch({
        type: adminConstants.CHOOSE_CARDS_FOR_EXPERIMENT,
        cardSetName: props.cardSetName,
      })
    },
    updateAdminCard: (props) => (cardProps) => {
      props.adminDispatch({
        type: adminConstants.ADD_CARD_TO_CARDSET,
        card: cardProps.card,
        id: cardProps.id,
        fileImageObject: cardProps.fileImageObject,
      })
    }
  }),
  lifecycle({
    componentDidMount() {
      console.log(this.props.cardSet)
      const isCardsArrayValid =
        this.props.cardSet.every((card) => card.imageUrl !== "" && card.primaryValue !== "" && card.secondaryValue !== "");
      if (isCardsArrayValid) {
        this.props.setCanSaveCards(true)
      }
    }
  })
)(AdminCards)
