<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Todo;
use Carbon\Carbon;
use Auth;
use DB;

class TodoController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:coach|admin', ['only' => ['complete_todo']]);
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get all todos.
     *
     * @return json
     */
    public function get_todos() {
        $pagination = create_pagination();
        $todos = Todo::select(
            DB::raw('SQL_CALC_FOUND_ROWS todo.todo_id'),
                'todo.title',
                'todo.content',
                'todo.date',
                'todo.created_at',
                'todo.completed_at',
                'todo.status',
                'user.display_name as assigned_to'
            )
            ->leftJoin('user', 'user.user_id', '=', 'todo.assignee')
            ->where('todo.franchise_id', $this->franchise_id)
            ->where('todo.club_id', $this->club_id)
            ->where(function($query){
                //allow filter by topic title
                if( isset($this->request['search']) && !empty($this->request['search']) ) {
                    $query->where('todo.title', 'like', '%' . $this->request['search'] . '%');
                }
                //allow filter by status
                if( isset($this->request['status']) && !empty($this->request['status']) ){
                    if( $this->request['status'] != 'late' ){
                        $query->where('todo.status', $this->request['status']);
                    } else {
                        //status is past so we need to get all pending todos with the completion deadline in the past
                        $query->where('todo.status', 'pending')
                            ->where('todo.date', '<', date('Y-m-d'));
                    }
                }
                //allow filter by role
                if( isset($this->request['date']) && !empty($this->request['date']) ){
                    switch ($this->request['date']) {
                      case 'today':
                        $query->whereRaw('Date(todo.date) = CURDATE()');
                        break;
                      case 'week':
                        //this week results
                        $from = Carbon::now()->startOfWeek()->toDateString();
                        $to = Carbon::now()->endOfWeek()->toDateString();
                        $query->whereBetween( DB::raw('date(todo.date)'), [$from, $to] );
                        break;
                      case 'month':
                        $from = Carbon::now()->startOfMonth()->toDateString();
                        $to = Carbon::now()->endOfMonth()->toDateString();
                        $query->whereBetween( DB::raw('date(todo.date)'), [$from, $to] );
                        break;
                      case 'year':
                        $from = Carbon::now()->startOfYear()->toDateString();
                        $to = Carbon::now()->endOfYear()->toDateString();
                        $query->whereBetween( DB::raw('date(todo.date)'), [$from, $to] );
                        break;
                    }
                }
                //for guardians only display guardians to do
                if( Auth::user()->hasRole('guardian') ){
                    $query->where('todo.user_roles', 'like', '%guardian%');
                }
                //for coaches only display coaches todo
                if( Auth::user()->hasRole('coach') ){
                    $query->where('todo.user_roles', 'like', '%coach%');
                }
                return $query;
            })
            ->orderBy('todo.date')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $search = create_filter('search', 'Search');
        //form the object for the statuses filter
        $statuses = (object)[
            0 => (object) ['key' => 'pending', 'value' => 'Pending'],
            1 => (object) ['key' => 'completed', 'value' => 'Completed'],
            2 => (object) ['key' => 'late', 'value' => 'Late']
        ];
        //create the status filter
        $filter_status = create_filter('status', 'Status', $statuses);
        $filters = [$search, $filter_status];
        if( Auth::user()->hasRole('admin') ){
            $roles = (object)[
                0 => (object) ['key' => 'today', 'value' => 'Today'],
                1 => (object) ['key' => 'week', 'value' => 'This week'],
                2 => (object) ['key' => 'month', 'value' => 'This month'],
                3 => (object) ['key' => 'year', 'value' => 'This year']
            ];
            $filter_roles = create_filter('date', 'Date', $roles);
            $filters = [$filter_status, $filter_roles, $search];
        }
        $count = reset($requestsCount)->count;
        return format_response($todos, $count, $filters);
    }

    /**
     * Get the todo with $todo_id
     *
     * @param int $todo_id
     * @return json
     */
     public function get_todo($todo_id) {
         $todo = Todo::select(
             'todo.*',
             'address_book.address_id',
             'address_book.title as address_title'
         )
             ->leftJoin('address_book', 'todo.venue_id', '=', 'address_book.address_id')
             ->where('todo.todo_id', $todo_id)
             ->first();

         return response()->json($todo, 200);
     }

    /**
     * Create a new todo.
     *
     * @return json
     */
     public function create_todo() {
         $this->validate($this->request, [
           'todos' => 'required|array|min:1',
           'todos.*.title' => 'required|string|max:255',
           'todos.*.date' => 'required|date_format:Y-m-d H:i:s|after:today',
           'todos.*.assignee' => 'required|integer|min:1',
           'todos.*.user_roles' => 'required|string',
           'todos.*.content' => 'string',
           'todos.*.is_public' => 'integer|min:0|max:1',
           'todos.*.send_email' => 'integer|min:0|max:1',
           'todos.*.status' => 'string|in:completed,pending',
           'todos.*.order' => 'integer'
         ],[
             'todos.*.date' => 'The todos date must be a date after today'
         ]);

         foreach($this->request['todos'] as $task){
             $todo = new Todo;
             $todo->franchise_id = $this->franchise_id;
             $todo->club_id = $this->club_id;
             $todo->title = $task['title'];
             $todo->date = $task['date'];
             isset($task['start_time']) ? $todo->start_time = $task['start_time'] : null;
             isset($task['end_time']) ? $todo->end_time = $task['end_time'] : null;
             isset($task['venue_id']) ? $todo->venue_id = $task['venue_id'] : null;
             $todo->assignee = $task['assignee'];
             $todo->user_roles = $task['user_roles'];
             $todo->content = isset($task['content']) ? $task['content'] : '';
             $todo->is_public = isset($task['is_public']) ? $task['is_public'] : 1;
             $todo->status = isset($task['status']) ? $task['status'] : 'pending';
             $todo->send_email = isset($task['send_email']) ? $task['send_email'] : 0;
             $todo->order = isset($task['order']) ? $task['order'] : 0;
             $todo->created_by = $this->user_id;
             $todo->updated_by = $this->user_id;
             $todo->save();
         }

         return response()->json('Success ', 200);
     }

     /**
      * Update the todo with $todo_id
      *
      * @param $todo_id
      * @return json
      */
      public function update_todo($todo_id) {
          $this->validate($this->request, [
            'title' => 'required|string|max:255',
            'date' => 'required|date_format:Y-m-d H:i:s|after:today',
            'assignee' => 'required|integer|min:1',
            'user_roles' => 'required|string|',
            'status' => 'string|in:completed,pending',
            'content' => 'string',
            'is_public' => 'integer|min:0|max:1',
            'send_email' => 'integer|min:0|max:1',
            'order' => 'integer'
          ]);

          $todo = Todo::find($todo_id);
          $todo->title = $this->request['title'];
          $todo->date = $this->request['date'];
          $todo->content = $this->request['content'];
          $todo->assignee = $this->request['assignee'];
          $todo->user_roles = $this->request['user_roles'];
          $todo->is_public = isset($this->request['is_public']) ? $this->request['is_public'] : 1;
          $todo->status = isset($this->request['status']) ? $this->request['status'] : 'pending';
          $todo->send_email = isset($this->request['send_email']) ? $this->request['send_email'] : 0;
          $todo->order = $this->request['order'];
          $todo->updated_by = $this->user_id;

          $this->request->has('start_time') ? $todo->start_time = Carbon::parse($this->request->start_time) : null;
          $this->request->has('end_time') ? $todo->end_time = Carbon::parse($this->request->end_time) : null;
          $this->request->has('venue_id') ? $todo->venue_id = $this->request->venue_id : null;

          $todo->save();

          return response()->json($todo);
      }

      /**
       * Delete the todo with $todo_id
       *
       * @param $todo_id
       * @return json
       */
       public function delete_todo($todo_id) {
           $todo = Todo::find($todo_id);

           $todo->delete();
           return response()->json('Deleted', 200);
       }

       /**
        * Mark todo as completed
        *
        * @param $todo_id
        * @return json
        */
        public function complete_todo($todo_id){
            $todo = Todo::find($todo_id);
            if( Auth::user()->hasRole('coach') && $todo->assignee != $this->user_id ){
                return response()->json('You do not have permissions to complete this to-do', 403);
            }

            $this->validate($this->request, [
                'completed_at' => 'date_format:Y-m-d H:i:s'
            ]);
            $todo->status = 'completed';
            $todo->completed_at = isset($this->request['completed_at']) ? $this->request['completed_at'] : date('Y-m-d');
            $todo->updated_by = $this->user_id;
            $todo->save();
            return response()->json('Completed', 200);
        }
}
