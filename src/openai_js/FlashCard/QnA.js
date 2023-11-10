import React, {useState} from 'react';
import { Card, CardBody } from 'reactstrap';

function FlashCardList({flashcards}){
  return(
    <div >
      {flashcards.map(flashcard => {
        return <FlashCardSingle flashcard={flashcard} key={flashcard.id} />
      })}
    </div>
  )
}

function FlashCardSingle({flashcard}){
  const [QnA, setQnA] = useState(flashcard.question)

  function changeContent(){
    if(flip){
      setQnA(flashcard.question)
    }
    else{
      setQnA(flashcard.answer)
    }
  }

  const [flip, setFlip] = useState(false)

  return(
    <Card 
      className={`${flip ? 'flip' : ''}`}
      onClick = {() => {setFlip(!flip); changeContent()}}>
        <CardBody>
          {QnA}
        </CardBody>
    </Card>

  )
}

const FlashCard = (fileText) => {
  const flashcardData = []

  function GenerateFlashCard(){
    const input = fileText.fileText
    let q;
    let ans;
    let APos;
    let QPos;

    const wordList = input.split("\n");
    wordList.forEach((word,index)=>{
      QPos = word.indexOf("Q:")
      APos = word.indexOf("A:")
      if(QPos != '-1'){
        q = "Question: " + word.substring(QPos+2)
      }
      if(APos != '-1'){
        ans = "Answer: " + word.substring(APos + 2)
        flashcardData.push({id:index, question:q, answer:ans})
      }
    })
  }

  return(
    <div>
      {flashcardData.length === 0 ? GenerateFlashCard() : null}
      <FlashCardList flashcards={flashcardData} />
    </div>
  )
}

export default FlashCard;