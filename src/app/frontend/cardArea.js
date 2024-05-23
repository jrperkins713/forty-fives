'use client'
import React, { useEffect, useState } from "react";
import CardHand from "./cardHand";
import Controller from "@/lib/controller";
import Card from "./Card";
import BetButtons from "./BetButtons";
import SuiteButtons from "./BetButtons copy";

export default function CardArea() {
  const [gameController, setGameController] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);
  const [status, setStatus] = useState('');

  function setGameState(playerArray) {
    setPlayers([...playerArray]);
  }

  useEffect(()=> {
    let newController = new Controller(setGameState, setPlayedCards);
    newController.addListener('playersUpdated', setGameState);
    newController.addListener('cardsUpdated', setPlayedCards);
    newController.addListener('statusUpdated', setStatus);
    setGameController(newController)
    newController.startGame()
  }, [])

  useEffect(()=> {
  }, [players])

  useEffect(()=> {
    if(status === 'OVER') {
      gameController.startGame();
    }
  }, [status])

  useEffect(()=> {
  }, [gameController])
  
  return (
      <div class="m-auto w-3/4 h-1/4 bg-green-700 h-3/4 border-8 border-amber-900 rounded-full flex">
        <div class='w-full h-full p-4'>
          <div class="rotate-180 h-48 m-auto w-64">
            <div class='relative h-1/2 w-16 bg-gray-500 m-auto -top-16'>
              <Card card={playedCards ? playedCards[2] : null}></Card>
            </div>
            <CardHand cards={players ? players[2] : []}></CardHand>
            
          </div>
          <div class='h-64 flex place-content-between space-x-64'>
            <div class="rotate-90 w-64 h-64 my-auto">
              <div class='relative h-1/2 w-16 bg-gray-500 m-auto -top-16'>
                <Card card={playedCards ? playedCards[1] : null}></Card>
              </div>
              <CardHand cards={players ? players[1] : []}></CardHand>
              
            </div>
            <div class="-rotate-90 w-64 h-64 my-auto">
              <div class='relative h-1/2 w-16 bg-gray-500 m-auto -top-16'>
                <Card card={playedCards ? playedCards[3] : null}></Card>
              </div>
              <CardHand cards={players ? players[3] : []}></CardHand>
            </div>
          </div>
          <div class="h-48 m-auto w-64">
            <div class='relative h-1/2 w-16 bg-gray-500 m-auto -top-16'>
              <Card card={playedCards ? playedCards[0] : null}></Card>
            </div>
            <CardHand controller={gameController} cards={players ? players[0] : []}></CardHand>
          </div>
        </div>
        {status === 'BETTING' && <BetButtons controller={gameController}></BetButtons>}
        {status === 'SELECT_TRUMP' && <SuiteButtons controller={gameController}></SuiteButtons>}
        {status === 'DISCARD' && <button class='absolute' onClick={()=>gameController.confirmDiscard()}>Confirm</button>}
      </div>
      
  );
}