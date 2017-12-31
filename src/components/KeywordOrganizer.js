import React from 'react'
import Keyword from './Keyword'
import Backend from '../utils/html5AndTouchBackend'
import MultiBackend from 'react-dnd-multi-backend'
import { DragDropContext } from 'react-dnd'

import '../css/KeywordOrganizer.css'

const KeywordOrganizer = ({ keywords, moveKeyword }) => (
  <div className="keyword-organizer">
    {keywords.map((k, i) =>
      <Keyword key={k} index={i} text={k} moveKeyword={moveKeyword} />
    )}
  </div>
)

export default DragDropContext(MultiBackend(Backend))(KeywordOrganizer)