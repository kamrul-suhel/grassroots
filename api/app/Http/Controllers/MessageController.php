<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Message;
use App\Topic;
use Auth;
use DB;

class MessageController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get all messages.
     *
     * @return json
     */
    public function get_messages() {
        $pagination = create_pagination();
        $messages = Message::select(
            DB::raw('SQL_CALC_FOUND_ROWS message.message_id'),
            'message.content',
            'message.topic_id',
            'message.created_at',
            'message.status',
            'message.created_by',
            'user.display_name AS author_name'
            )
            ->leftJoin('user', 'user.user_id', '=', 'message.created_by')
            ->where('message.franchise_id', $this->franchise_id)
            ->where('message.club_id', $this->club_id)
            ->orderBy('message.created_at', 'DESC')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        return format_response($messages, $count);
    }

    /**
     * Get a specific message
     *
     * @param $message_id
     * @return json
     */
     public function get_message($message_id){
         $message = Message::find($message_id);
         return response()->json($message, 200);
     }

     /**
      * Create a new message
      *
      * @return json
      */
      public function create_message(){

          //validate the request
          $this->validate($this->request, [
            'content' => 'required|max:255',
            'topic_id' => 'required|integer|min:0',
            'reply_to' => 'integer|min:0',
          ]);

          $message = new Message;
          $message->franchise_id = $this->franchise_id;
          $message->club_id = $this->club_id;
          $message->content = $this->request['content'];
          $message->topic_id = $this->request['topic_id'];
          $message->reply_to = $this->request['reply_to'];
          $message->created_by = $this->user_id;
          $message->save();
          //update the topic update_at value
          $topic = Topic::find($this->request['topic_id']);
          $topic->created_at = date('Y-m-d H:i:s');
          $topic->updated_at = date('Y-m-d H:i:s');
          $topic->save();

          return response()->json($message, 200);
      }

      /**
       * Update the message with $message_id
       *
       * @param $message_id
       * @return json
       */
       public function update_message($message_id){

           //validate the request
           $this->validate($this->request, [
             'content' => 'required|max:255',
             'topic_id' => 'required|integer|min:0',
             'reply_to' => 'integer|min:0',
           ]);

           $message = Message::find($message_id);
           $message->content = $this->request['content'];
           $message->topic_id = $this->request['topic_id'];
           $message->reply_to = $this->request['reply_to'];
           $message->updated_by = $this->user_id;
           $message->save();

           return response()->json($message, 200);
       }

       /**
        * Delete the message with $message_id
        *
        * @param $message_id
        * @return json
        */
        public function delete_message($message_id) {
            $message = Message::find($message_id)->delete();

            return response()->json('Message successfully deleted', 200);
        }
}
