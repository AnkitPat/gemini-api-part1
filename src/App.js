import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SimpleResponse from "./containers/SimpleResponse";
import Base from "./containers/Base";
import ConversationList from "./containers/ConversationList";
import { ContextWrapper } from "./components/context";
import SingleConversation from "./containers/SingleConversation";
import SingleConversationStream from "./containers/SingleConversationStream";

const App = () => {
  const paths = createBrowserRouter([
    {
      path: '/',
      Component: Base
    },
    {
      path: '/simple',
      Component: SimpleResponse
    },
    {
      path: '/conversationList',
      Component: ConversationList
    }, {
      path: '/chat/:id',
      Component: SingleConversation
    }, {
      path: '/chat-stream/:id',
      Component: SingleConversationStream
    }
  ])

return <ContextWrapper><RouterProvider router={paths} fallbackElement={<p>Loading...</p>} /></ContextWrapper>
}
export default App;