<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Invoice;
use App\InvoiceLine;
use App\User;
use App\Faq;
use Carbon\Carbon;
use Auth;
use DB;

class FaqController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:superadmin', ['except' => ['list']]);
        $this->user_id = Auth::id();
    }

    /**
     * Create a new faq
     *
     * @return json
     */
    public function create()
    {

        $this->validate($this->request, [
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'type' => 'required|string|max:255',
            'faq_section' => 'required|string',
            'status' => 'int|min:0|max:1'
        ]);

        $faq = new Faq;
        $faq->question = $this->request['question'];
        $faq->answer = $this->request['answer'];
        $faq->type = $this->request['type'];
        $faq->faq_section = $this->request['faq_section'];

        // Upload file is exists
        $filePath = '';
        $fileType = '';
        if (isset($this->request['file']) &&
            !empty($this->request['file']) &&
            $this->request->hasFile('file')
        ) {
            // Upload file if exists for fixture
            $file = $this->request->file('file');
            $filePath = gr_save_file($file, 'faq', $this->user_id);
            $filePath = $filePath;
            $fileType = $file->getClientOriginalExtension();
        }
        $faq->file_path = $filePath;
        $faq->file_type = $fileType;
        $faq->status = isset($this->request['status']) ? $this->request['status'] : 1;
        $faq->created_by = $this->user_id;
        $faq->updated_by = $this->user_id;
        $faq->save();

        return response()->json($faq, 200);
    }

    /**
     * List all faq
     *
     * @return json
     */
    public function list()
    {
        $auth_user = Auth::user();
        $pagination = create_pagination();
        $faqs = Faq::select(
            DB::raw('SQL_CALC_FOUND_ROWS faq.id'),
            'faq.id',
            'faq.question',
            'faq.file_path',
            'faq.file_type',
            'faq.answer',
            'faq.type',
            'faq.faq_section'
        )
            ->where(function ($query) use ($auth_user) {
                //allow filter by address type for super admins
                if ($auth_user->hasRole('superadmin')) {
                    if (isset($this->request['type']) && !empty($this->request['type'])) {
                        $query->where('faq.type', 'like', '%' . $this->request['type'] . '%');
                    }
                } else if ($auth_user->hasRole('groupadmin')) {
                    $query->where('faq.type', 'like', '%superadmin%');

                } else {
                    //for non super admin roles just display their roles faq
                    $role = gr_get_role_title($auth_user->user_role);
                    if ($role == 'admin') {
                        //change admin to clubadmin so we dont have conflicts in LIKE clause
                        $role = 'clubadmin';
                    }
                    $query->where('faq.type', 'like', '%' . $role . '%');
                }
                return $query;
            });

        if ($this->request->has('faq_section') && !empty($this->request->faq_section)) {
            $faqs = $faqs->where('faq_section', 'LIKE', '%' . $this->request->faq_section . '%');
        }

        // If search params set
        if($this->request->has('search')){
            $faqs = $faqs->where('question', 'LIKE', '%'. $this->request->search .'%');
        }

        $faqs = $faqs->limit($pagination['per_page'])
            ->orderBy('faq.question')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;

        $search = create_filter('search', 'Search');
        $faqType = (object)[
            (object)[
                'key'=> 'superAdmin',
                'value' => 'Super Admin'
            ],
            (object)[
                'key'=> 'clubAdmin',
                'value' => 'Club Admin'
            ],
            (object)[
                'key'=> 'coach',
                'value' => 'Coaches'
            ],
            (object)[
                'key'=> 'parents',
                'value' => 'Parents'
            ]
        ];

        $select = create_filter('type', 'Display For', $faqType);
        $filters = [$search, $select];

        return format_response($faqs, $count, $filters);
    }

    /**
     * List the faq with $id
     *
     * @return json
     */
    public function single($id)
    {
        $faq = Faq::find($id);
        if (empty($faq)) {
            return response()->json('Faq not found', 404);
        }

        return response()->json($faq);
    }

    /**
     * Update the faq with $id
     *
     * @return json
     */
    public function update($id)
    {

        $this->validate($this->request, [
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'type' => 'required|string|max:255',
            'status' => 'int|min:0|max:1'
        ]);

        $faq = Faq::find($id);

        if (empty($faq)) {
            return response()->json('Faq not found', 404);
        }

        // Upload file is exists
        if (isset($this->request['file']) && !empty($this->request['file'])) {
            // Upload file if exists for fixture
            $file = $this->request->file('file');
            $filePath = gr_save_file($file, 'faq', $this->user_id);
            $filePath = $filePath;
            $fileType = $file->getClientOriginalExtension();

            $faq->file_path = $filePath;
            $faq->file_type = $fileType;
        }

        $faq->question = $this->request['question'];
        $faq->answer = $this->request['answer'];
        $faq->type = $this->request['type'];
        $faq->faq_section = $this->request['faq_section'];
        if (isset($this->request['status'])) {
            $faq->status = $this->request['status'];
        }
        $faq->updated_by = $this->user_id;
        $faq->save();

        return response()->json($faq);
    }

    /**
     * Delete the faq with $id
     *
     * @return json
     */
    public function delete($id)
    {
        $faq = Faq::find($id);
        if (empty($faq)) {
            return response()->json('Faq not found', 404);
        }
        $faq->delete();

        return response()->json('Faq successfully deleted');
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function fileUpload(){
        if($this->request->hasFile('file')){
            $file = $this->request->file;
            $filePath = gr_save_file($file, 'faq-content', '');
            return response()->json(['file_path' => $filePath]);
        }else{
            return response()->json('no file found');
        }

        return response()->json($this->request->file);
    }

}
