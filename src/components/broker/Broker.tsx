import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Search, MoreHorizontal, Plus, Edit, Trash2, Eye, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Broker {
  _id: string;
  name: string;
  description?: string;
  image: string;
  fields: {
    name: string;
    type: string;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
  }[];
  isActive: boolean;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'date', label: 'Date' },
  { value: 'file', label: 'File' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'textarea', label: 'Text Area' },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  image: z.any().optional(),
  fields: z.array(
    z.object({
      name: z.string().min(1, "Field name is required"),
      type: z.string().min(1, "Field type is required"),
      label: z.string().min(1, "Label is required"),
      required: z.boolean().default(false),
      placeholder: z.string().optional(),
      options: z.array(z.string()).optional(),
    })
  ).optional(),
});

const BrokerManagement = () => {
  const token = Cookies.get('auth_token');
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBroker, setCurrentBroker] = useState<Broker | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      fields: [],
    },
  });

  const { fields: formFields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  useEffect(() => {
    if (currentBroker) {
      form.reset({
        name: currentBroker.name,
        description: currentBroker.description || "",
        fields: currentBroker.fields.map(field => ({
          name: field.name,
          type: field.type,
          label: field.label,
          required: field.required || false,
          placeholder: field.placeholder || "",
          options: field.options || [],
        })),
      });
    } else {
      form.reset({
        name: "",
        description: "",
        fields: [],
      });
    }
  }, [currentBroker, form]);

  const fetchBrokers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/brokers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBrokers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      toast.error('Failed to fetch brokers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      
      if (values.image) {
        formData.append('image', values.image);
      }
      
      if (values.fields) {
        formData.append('fields', JSON.stringify(values.fields));
      }

      if (isEditing && currentBroker) {
        await axios.put(`http://localhost:4000/api/admin/brokers/${currentBroker._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Broker updated successfully');
      } else {
        await axios.post('http://localhost:4000/api/admin/brokers', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Broker created successfully');
      }

      setIsDialogOpen(false);
      fetchBrokers();
    } catch (error) {
      console.error('Error submitting broker:', error);
      toast.error('Failed to submit broker');
    }
  };

  const handleDelete = async (brokerId: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/brokers/${brokerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Broker deleted successfully');
      fetchBrokers();
    } catch (error) {
      console.error('Error deleting broker:', error);
      toast.error('Failed to delete broker');
    }
  };

  const handleStatusChange = async (brokerId: string, status: 'approve' | 'reject') => {
    try {
      await axios.patch(
        `http://localhost:4000/api/admin/brokers/${brokerId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Broker ${status === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchBrokers();
    } catch (error) {
      console.error('Error updating broker status:', error);
      toast.error(`Failed to ${status} broker`);
    }
  };

  const addNewField = () => {
    append({
      name: '',
      type: 'text',
      label: '',
      required: false,
      placeholder: '',
      options: [],
    });
  };

  const addOption = (index: number) => {
    const currentOptions = form.getValues(`fields.${index}.options`) || [];
    form.setValue(`fields.${index}.options`, [...currentOptions, '']);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`fields.${fieldIndex}.options`) || [];
    const newOptions = currentOptions.filter((_, i) => i !== optionIndex);
    form.setValue(`fields.${fieldIndex}.options`, newOptions);
  };

  const filteredBrokers = brokers.filter(broker =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Broker Management
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setCurrentBroker(null);
                setIsEditing(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Broker
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Broker' : 'Add New Broker'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter broker name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              field.onChange(e.target.files[0]);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Fields Configuration</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addNewField}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                  </div>

                  {formFields.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No fields added yet
                    </div>
                  )}

                  {formFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Field {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`fields.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Field Name (Key)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., full_name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`fields.${index}.label`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Label</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Full Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`fields.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Field Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select field type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {fieldTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`fields.${index}.required`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col justify-end h-full">
                              <div className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                </FormControl>
                                <FormLabel className="!mt-0">Required Field</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch(`fields.${index}.type`) !== 'select' && 
                        form.watch(`fields.${index}.type`) !== 'radio' && 
                        form.watch(`fields.${index}.type`) !== 'checkbox' && (
                        <FormField
                          control={form.control}
                          name={`fields.${index}.placeholder`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Placeholder Text</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {(form.watch(`fields.${index}.type`) === 'select' || 
                        form.watch(`fields.${index}.type`) === 'radio' || 
                        form.watch(`fields.${index}.type`) === 'checkbox') && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <FormLabel>Options</FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(index)}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Add Option
                            </Button>
                          </div>

                          {form.watch(`fields.${index}.options`)?.map((_, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <Input
                                placeholder={`Option ${optionIndex + 1}`}
                                {...form.register(`fields.${index}.options.${optionIndex}`)}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() => removeOption(index, optionIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditing ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rest of your component remains the same */}
     <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Brokers ({brokers.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search brokers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 bg-input border-border text-foreground"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrokers.map((broker) => (
                  <TableRow key={broker._id}>
                    <TableCell className="font-medium">{broker.name}</TableCell>
                    <TableCell>{broker.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {broker.fields.map((field) => (
                          <Badge key={field._id} variant="outline" className="text-xs">
                            {field.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          broker.status === 'pending' ? 'border-yellow-500 text-yellow-500' :
                          broker.status === 'approved' ? 'border-green-500 text-green-500' :
                          broker.status === 'rejected' ? 'border-red-500 text-red-500' :
                          'border-gray-500 text-gray-500'
                        }`}
                      >
                        {broker.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(broker.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem
                            className="text-popover-foreground hover:bg-accent"
                            onClick={() => {
                              setCurrentBroker(broker);
                              setIsDialogOpen(true);
                              setIsEditing(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/20"
                            onClick={() => handleDelete(broker._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          {broker.status === 'pending' && (
                            <>
                              <DropdownMenuItem
                                className="text-green-500 hover:bg-green-500/20"
                                onClick={() => handleStatusChange(broker._id, 'approve')}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500 hover:bg-red-500/20"
                                onClick={() => handleStatusChange(broker._id, 'reject')}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrokerManagement;