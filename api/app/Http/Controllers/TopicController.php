<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Message;
use App\Topic;
use Auth;
use DB;

class TopicController extends Controller {
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
     * Get all topics.
     *
     * @return json
     */
    public function get_topics() {
        $pagination = create_pagination();
        $topics = Topic::select(
            DB::raw('SQL_CALC_FOUND_ROWS topic.topic_id'),
            'topic.title',
            'topic.content',
            'topic.created_at',
            'topic.created_by',
            'user.display_name AS author_name'
            )
            ->leftJoin('user', 'user.user_id', '=', 'topic.created_by')
            ->where('topic.franchise_id', $this->franchise_id)
            ->where('topic.club_id', $this->club_id)
            ->where(function($query){
                //allow filter by topic title
                if( isset($this->request['name']) && !empty($this->request['name']) ) {
                    $query->where('topic.title', 'like', '%' . $this->request['name'] . '%');
                }
                return $query;
            })
            ->orderBy('topic.is_featured')
            ->orderBy('topic.updated_at', 'DESC')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        return format_response($topics, $count);
    }

    /**
     * Get the topic with $topic_id
     *
     * @return json
     */
     public function get_topic($topic_id) {
         $topic = Topic::find($topic_id);

         return response()->json($topic, 200);
     }

    /**
     * Create a new topic.
     *
     * @return json
     */
     public function create_topic() {
         $this->validate($this->request, [
           'title'               => 'required|string|max:255',
           'is_guardian_blocked' => 'integer|min:0|max:1',
           'status'              => 'integer|min:0|max:1',
           'is_featured'         => 'integer|min:0|max:1',
           'content'             => 'string'
         ]);

         $is_guardian_blocked = 0;
         $is_featured = 0;
         $status = 0;

         $topic = new Topic;
         $topic->franchise_id = $this->franchise_id;
         $topic->club_id = $this->club_id;
         $topic->title = $this->request['title'];

         if( isset($this->request['is_guardian_blocked']) && !empty($this->request['is_guardian_blocked']) ) {
             $is_guardian_blocked = $this->request['is_guardian_blocked'];
         }

         if( isset($this->request['status']) && !empty($this->request['status']) ) {
             $status = $this->request['status'];
         }

         if( isset($this->request['is_featured']) && !empty($this->request['is_featured']) ) {
             $is_featured = $this->request['is_featured'];
         }

         if( isset($this->request['content']) && !empty($this->request['content']) ) {
             $topic->content = $this->request['content'];
         }

         $topic->is_guardian_blocked = $is_guardian_blocked;
         $topic->is_featured = $is_featured;
         $topic->created_by = $this->user_id;
         $topic->status = $status;

         $topic->save();

         return response()->json($topic, 200);
     }

     /**
      * Update the topic with $topic_id
      *
      * @param $topic_id
      * @return json
      */
      public function update_topic($topic_id) {
          $this->validate($this->request, [
            'title'               => 'required|string|max:255',
            'is_guardian_blocked' => 'required|integer|min:0|max:1',
            'status'              => 'required|integer|min:0|max:1',
            'is_featured'         => 'required|integer|min:0|max:1',
            'content'             => 'string'
          ]);

          $topic = Topic::find($topic_id);

          $topic->title = $this->request['title'];
          $topic->content = $this->request['content'];
          $topic->is_guardian_blocked = $this->request['is_guardian_blocked'];
          $topic->updated_by = $this->user_id;
          $topic->status = $this->request['status'];
          $topic->is_featured = $this->request['is_featured'];

          $topic->save();

          return response()->json($topic, 200);
      }

      /**
       * Delete the topic with $topic_id and the messages assigned to it
       *
       * @param $topic_id
       * @return json
       */
       public function delete_topic($topic_id) {

           $topic = Topic::find($topic_id);
           $topic->delete();
           //delete all the messages assigend to this topic
           Message::where('topic_id', $topic_id)->delete();

           return response()->json('Topic Deleted', 200);
       }

    /**
     * Get all messegess assigned to a topic.
     *
     * @param $topic_id
     * @return json
     */
     public function get_topic_messages($topic_id) {
         $messages = Message::select(
                'message.message_id',
                'message.content',
                'message.reply_to',
                'message.created_at',
                'message.created_by',
                'user.user_id AS author_id',
                'user.display_name AS author_name',
                'topic.topic_id'
             )
             ->leftJoin('topic', 'topic.topic_id', '=', 'message.topic_id')
             ->leftJoin('user', 'user.user_id', '=', 'message.created_by')
             ->where('topic.topic_id', $topic_id)
             ->orderBy('message.created_at', 'DESC')
             ->get();
        $topic = Topic::select(
            'topic.title',
            'topic.content',
            'topic.created_at',
            'topic.created_by',
            'user.display_name AS author_name'
            )
            ->leftJoin('user', 'user.user_id', '=', 'topic.created_by')
            ->where('topic.franchise_id', $this->franchise_id)
            ->where('topic.club_id', $this->club_id)
            ->where('topic.topic_id', $topic_id)
            ->first();

        $results = array(
            'topic_id' => $topic_id,
            'author_name' => $topic->author_name,
            'title' => $topic->title,
            'content' => $topic->content,
            'created_at' => $topic->created_at->toDateTimeString(),
            'created_by' => $topic->created_by,
            'messages' => $messages
        );

        return response()->json($results,  200);
     }
}
